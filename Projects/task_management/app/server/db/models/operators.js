const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const finishing_and_bindings = require('./finishing_and_bindings')

const print_covers = require('./print_cover');
const print_pages = require('./print_pages');


const operators =  sequelize.define("operators",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    operator_name : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    operator_type : {
        type : Sequelize.STRING,
        allowNull : false
    }


});


// operators.hasMany(print_covers, { foreignKey: 'print_cover_operator_id' });

// print_covers.belongsTo(operators, { foreignKey: 'print_cover_operator_id' });

// operators.hasMany(print_pages, { foreignKey: 'job_print_operator_id' });

// print_pages.belongsTo(operators, { foreignKey: 'job_print_operator_id' });



 operators.sync({ alter: true });

module.exports = operators