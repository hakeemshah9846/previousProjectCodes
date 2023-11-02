const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const print_pages = require('./print_pages');
const print_cover = require('./print_cover');
const printer_papers = require('./printer_papers');


const papers =  sequelize.define("papers",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    
    paper_name : {
        //paper_name
        type: Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    paper_size : {
        //paper_size
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    paper_weight : {
        //paper_weight
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : ''
    },

    paper_unitcost : {
        //paper_unitcost
        type : Sequelize.DECIMAL(10,4),
        allowNull : false,
        // defaultValue : '0.0000',
    },

    paper_type :{
        //paper_type
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : ','
    },

    paper_dimension : {
        //paper_dimension
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : ','
    },

});

// papers.hasMany(print_pages, { foreignKey: 'paper_type_id' });

// print_pages.belongsTo(papers, { foreignKey: 'paper_type_id' });

//  papers.hasMany(print_cover, { foreignKey: 'print_cover_paper_type_id' });

//  print_cover.belongsTo(papers, { foreignKey: 'print_cover_paper_type_id' });

// papers.hasMany(printer_papers, { foreignKey: 'paper_id' });

// printer_papers.belongsTo(papers, { foreignKey: 'paper_id' });

 papers.sync({ alter: true });

module.exports = papers