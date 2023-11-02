const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const print_covers = require('./print_cover');
const print_pages = require('./print_pages');
const printer_papers = require('./printer_papers');


const printers =  sequelize.define("printers",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    name : {
        type: Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    status : {
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    color_type : {
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },


    cost : {
        type : Sequelize.DECIMAL(10,4),
        allowNull : false,
        // defaultValue : '0.0000',
    },

    paper_support : {
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    }

});

// printers.hasMany(print_covers, { foreignKey: 'print_cover_machine_id' });

// print_covers.belongsTo(printers, { foreignKey: 'print_cover_machine_id' });


// printers.hasMany(print_pages, { foreignKey: 'print_pages_machine' });

// print_pages.belongsTo(printers, { foreignKey: 'print_pages_machine' });

printers.hasMany(printer_papers, { foreignKey: 'printer_id' });

printer_papers.belongsTo(printers, { foreignKey: 'printer_id' });


//  printers.sync({ alter: true });

module.exports = printers