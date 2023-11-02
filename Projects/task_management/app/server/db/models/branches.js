const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const branches =  sequelize.define("branches",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
branch : {
        type: Sequelize.STRING,
        allowNull : false,
    },


});

 branches.sync({ alter: true });

module.exports = branches