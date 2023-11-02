const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');

const revokedTokens =  sequelize.define("revoked_tokens",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    token:{
        type: Sequelize.TEXT,
        allowNull: false,
    },

    revoked_at:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = revokedTokens