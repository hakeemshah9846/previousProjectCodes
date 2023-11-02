const {Sequelize, INTEGER} = require('sequelize');
const sequelize = require('../db-conn');


const job_types = sequelize.define('job_types', {

    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    job_type : {
        type : Sequelize.STRING,
        allowNull : false,
        // unique : true,
    }
});


job_types.sync({alter : true});

module.exports = job_types