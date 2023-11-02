const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const notifications =  sequelize.define("notifications",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    type_id:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    organization_id:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    description:{
        type: Sequelize.TEXT,
        allowNull: false,
    },

    scheduled_at:{
        type: Sequelize.DATE,
        allowNull: true,
    },

    created_by:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    created_on:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    response_type:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    status:{
        type: Sequelize.STRING,
        allowNull: false,
    },

    deleted_at:{
        type: Sequelize.STRING,
        allowNull: true,
    }
});

module.exports = notifications