const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const viewedNotifications =  sequelize.define("viewed_notifications",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    notification_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    user_id:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = viewedNotifications