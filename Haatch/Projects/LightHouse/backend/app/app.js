require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const socialRoutes = require("./routes/socialRoutes");
const requestRoutes = require("./routes/requestRoutes");
const donationRoutes = require("./routes/donationRoutes");
const userLevelRoutes = require("./routes/userLevelRoutes");
const informationRoutes = require("./routes/informationRoutes");
const donationCrons =  require("./utils/crons/donation");
const db = require("./db/config");

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/assets', express.static(__dirname + '/assets') );

//Invoking mongodb connection
db.connect();

//Invoking server port connection
app.listen(process.env.NODE_PORT, () => {
    console.log(`Listening on port ${process.env.NODE_PORT}`);
});

//invoking cron job for sending emails to approver on auctions expire
donationCrons.updateStatus();

//authentication routes
app.use(authRoutes);

//user routes
app.use(userRoutes);

//collection routes
app.use(collectionRoutes);

//payment routes
app.use(paymentRoutes);

//social media routes
app.use(socialRoutes);

//request routes
app.use(requestRoutes);

//donation routes
app.use(donationRoutes);

//user level routes
app.use(userLevelRoutes);

//information routes
app.use(informationRoutes);

//404 implementation
app.use(function (req, res) {
    let response = {
        "success": false,
        "status": 404,
        "message": "API not found",
        "data": null
    }
    res.status(404).send(response);
});