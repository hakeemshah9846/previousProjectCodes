require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./db/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const documentRoutes = require('./routes/documentRoutes');
// // const bloodGroupsModel = require('./db/models/blood_groups');
const departmentsModel = require('./db/models/departments');
// // const employeeTypesModel = require('./db/models/employee_types');
// const profileStatusModel = require('./db/models/profile_statuses');

// const salary_history_model = require('./db/models/salary_history');
// const user_model = require('./db/models/users');
// const user_types_model = require('./db/models/user_types');
// const revoked_tokens = require('./db/models/revoked_tokens');
// const profile_statuses = require('./db/models/profile_statuses');
// const employee_types = require('./db/models/employee_types');
// const departments = require('./db/models/departments');
// const blood_groups = require('./db/models/blood_groups');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
// app.use(cors({
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
// }));

app.use(cors());


app.use('/uploads',express.static(__dirname + '/uploads'));

//MongoDB connection
db.connect();
//Invoking server port connection
app.listen(process.env.NODE_PORT, () => {
    console.log(`Listening on port ${process.env.NODE_PORT}`);
});


//authentication routes
app.use(authRoutes);

//user routes
app.use(userRoutes);

//salary routes
app.use(salaryRoutes);

//organization routes
app.use(organizationRoutes);

//integration routes
app.use(integrationRoutes);

//document routes
app.use(documentRoutes);

// Zoho call back route
app.get('/auth/zoho/callback/:organization_id', (req, res) => {
    console.log("Zoho callback called...");
    console.log("Code : ", req.query.code);
    console.log("organization_id : ", req.query.organization_id);
    // console.log("Request : ", req);

});