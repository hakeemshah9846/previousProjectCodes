const {Sequelize, INTEGER} = require('sequelize');
const sequelize = require('../db-conn');
const request_profile = require('./request_profile');


const campus = sequelize.define('campus', {

    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    campus : {
        type : Sequelize.STRING,
        allowNull : false,
        // unique : true,
        defaultValue : '',
    }
});

campus.hasMany(request_profile, { foreignKey: 'campus_id' });

request_profile.belongsTo(campus, { foreignKey: 'campus_id' });


// campus.sync({alter : true});

module.exports = campus