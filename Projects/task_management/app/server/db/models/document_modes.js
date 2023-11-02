const {Sequelize, INTEGER} = require('sequelize');
const sequelize = require('../db-conn');


const document_modes = sequelize.define('document_modes', {

    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    document_mode : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    }
});


document_modes.sync({alter : true});

module.exports = document_modes