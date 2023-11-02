const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const responses =  sequelize.define("responses",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    user_id:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    response:{
        type: Sequelize.TEXT,
        allowNull: false,
    },

    notification_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    organization_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    branch_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    group_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = responses