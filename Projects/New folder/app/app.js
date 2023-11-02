const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

//Using bodyParser
app.use(bodyParser.json({limit : '100mb'}));
app.use(bodyParser.urlencoded({limit : '100mb', extended : true}));

//Using express
app.use(express.json({limit : '100mb'}));
app.use(express.urlencoded({limit : '100mb', extended : true}));

//Adding cors middleware to avoid cross origin error
app.use(cors());
//Connecting mongodb through mongoose
async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

//Calling mongodb connection function
connect()
.then(() => {
  console.log("Database connection established...");
})
.catch((err) => {
  console.log("Error connecting : ", err);
});

//Test route for testing
console.log("REached here...")
  app.get('/test', (req, res) => {
    res.status(200).send({"message" : "Success"});
  })

  app.use(authRoutes);
  app.use(dataRoutes);

app.listen(3000, () => {
    console.log("App listening at port 3000");
});
  