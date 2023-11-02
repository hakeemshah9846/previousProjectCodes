const {Sequelize, INTEGER} = require('sequelize');
const sequelize = require('../db-conn');


const document_types = sequelize.define('document_types', {

    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    document_type : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    }
});


document_types.sync({alter : true});

module.exports = document_types