const {Sequelize} = require('sequelize');
const sequelize = require('../db-conn');

const entities = sequelize.define('entities', {

    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },

    entity : {
        type : Sequelize.STRING,
        allowNull : false
    }
});

// entities.sync({alter : true});


module.exports = entities