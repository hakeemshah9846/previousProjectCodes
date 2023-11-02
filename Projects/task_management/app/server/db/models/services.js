const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const services =  sequelize.define("services",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    service_name : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    service_cost : {
        type : Sequelize.STRING,
        allowNull : false,
    }


});

//  department.sync({ force: true });

module.exports = services