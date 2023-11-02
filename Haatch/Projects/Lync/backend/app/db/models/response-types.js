const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const responseTypes =  sequelize.define("response_types",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    title:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = responseTypes