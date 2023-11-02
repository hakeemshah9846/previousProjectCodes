const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const targetGroups =  sequelize.define("target_groups",{
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

    branch_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    group_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = targetGroups