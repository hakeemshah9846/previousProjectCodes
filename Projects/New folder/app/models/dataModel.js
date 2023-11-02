const mongoose  = require('mongoose');


const datas = new mongoose.Schema({
    doubled_array : [Number],
    sum : Number,
    status : String
},
{
    timestamps : true,
});

module.exports = mongoose.model("datas", datas);
