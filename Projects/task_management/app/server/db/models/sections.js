const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const request_profile = require('./request_profile');


const sections =  sequelize.define("sections",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    section : {
        type: Sequelize.STRING,
        allowNull : false,
        },


});

sections.hasMany(request_profile, { foreignKey: 'section_id' });

request_profile.belongsTo(sections, { foreignKey: 'section_id' });

//  sections.sync({ alter: true });

module.exports = sections