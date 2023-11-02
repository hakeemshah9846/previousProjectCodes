const mongoose = require('mongoose');
const usersModel = require('../db/models/users');

var options = {
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect('mongodb://pomograd_db:27017/test', options, (err)=>{
    if (err)
    {
        console.log("From mongo_seeder : ",err);
    }
    else
    {
        console.log("Database Connection Established From mongo_seeder");
    }
});


const users = [
    {
        first_name: "John",
        last_name: 'Doe',
        email: "vljazwdcmupcedesen@tmmcv.net",
        password: "GYu5t77%7o$G",

    }
]





