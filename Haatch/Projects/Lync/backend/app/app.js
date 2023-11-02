require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dayjs = require('dayjs');
const cron = require('node-cron');
const lyncRoutes = require("./routes/lyncRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const sequelize = require("./db/db-conn");
const notifications = require('./db/models/notifications');
const Op = require('sequelize').Op;
const app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

sequelize.sync().then((result)=>{
    app.listen(process.env.NODE_PORT);
    console.log('Database Connection Established');
    console.log(`Running on port ${process.env.NODE_PORT}`)
})

//lync routes
app.use(lyncRoutes);

//notification routes
app.use(notificationRoutes);

//scheduling notifications
//all the past notifications are set to active state
cron.schedule('* * * * *', () => {
    try{
        let now = dayjs().format("YYYY-MM-DD HH:mm");
        notifications.update(
            {
                status: "active",
                scheduled_at : null
            },
            {
            where: {
                    [Op.and]: [{ scheduled_at: {[Op.ne]: null}}, { status: "active" }, { scheduled_at: {[Op.lte]: now}}]
            }
        });
    }
    catch(error)
    {
        console.log(error);
    }
});

//404 implementation
app.use(function (req, res) {
    let response = {
        "status":"failed",
        "data" : "API not found"
    }
    res.status(404).send(response);
});