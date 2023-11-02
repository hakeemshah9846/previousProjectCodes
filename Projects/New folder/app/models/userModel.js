const mongoose = require('mongoose');

const users = new mongoose.Schema({
    user_name : "string",
    password : "string"
},
{
    timestamps : true,
});


module.exports = mongoose.model("users", users);
