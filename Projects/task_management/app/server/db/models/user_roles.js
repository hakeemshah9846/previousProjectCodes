const {Sequelize} = require('sequelize');
const sequelize = require('../db-conn');
const user_roles_connection = require('./user_roles_connection');
const users = require('./users');


const user_roles =  sequelize.define("user_roles",{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    // user_id :{
    //     //id from user table
    //     type: Sequelize.INTEGER,
    //     allowNull: false,

    // },

    role:{
        type: Sequelize.STRING,
        allowNull: false,
    },


}, 
{
    paranoid : true,
});



user_roles.sync({ alter: true });

module.exports = user_roles

