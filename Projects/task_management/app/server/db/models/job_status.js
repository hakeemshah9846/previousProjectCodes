const {Sequelize, INTEGER} = require('sequelize');
const sequelize = require('../db-conn');


const job_status = sequelize.define('job_status', {

    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    status : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    }
});


job_status.sync({alter : true});

module.exports = job_status