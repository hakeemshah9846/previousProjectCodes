require("dotenv").config();

const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const dayjs = require("dayjs");

const cron = require("node-cron");

const sequelize = require("./db/db-conn");

const Op = require("sequelize").Op;

const app = express();

const authRoutes = require('./routes/authRoutes');

const userRoutes = require('./routes/userRoutes');

const jobRoutes  = require('./routes/jobRoutes');

const finishingAndBindingRoutes = require('./routes/finishingAndBindingRoutes');

const printCoverRoutes = require('./routes/printCoverRoutes');

const printPagesRoutes = require('./routes/printPagesRoutes');


// const model = require('./db/models/printer_colors');
// const old_model = require('./db/old_models/dc_jobbinding');


app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads',express.static(__dirname + '/uploads'));


sequelize.sync().then((result) => {
//   result.query('CREATE DATABASE IF NOT EXISTS task_management;').then(() => {
//     // Safe to use sequelize now
//     console.log("Database Created by sequelize.......");
//   });

  app.listen(process.env.NODE_PORT);
  console.log("Database Connection Established");
  console.log(`Running on port ${process.env.NODE_PORT}`);
});



app.use(authRoutes);

app.use(userRoutes);

app.use(jobRoutes);

app.use(finishingAndBindingRoutes);

app.use(printCoverRoutes);

app.use(printPagesRoutes);

