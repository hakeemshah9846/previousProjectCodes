const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const print_pages =  sequelize.define("print_pages",{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    dev_flag : {
        type : Sequelize.BOOLEAN,
    },

    job_id : {
        //From jobs table sent through req body
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    print_pages_machine : {
        //values from printer table
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    job_print_color_id : {
        //Replace with id from print_pages_colors table
        //From print_pages_colors table
        type : Sequelize.INTEGER,
        allowNull : false
    },


    job_print_operator_id : {
        //From operators table
        type: Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    paper_type_id : {
        //From papers table
        type: Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    job_print_pages : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },


    job_print_quantity : {
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

    job_done_date : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '0000-00-00 00:00:00',
    },

    job_status : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',

    },

    job_req_comment : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    job_print_comment : {
        type : Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    print_sides : {
        //Single or Double
        type: Sequelize.STRING,
        allowNull : false,
        // defaultValue : '',
    },

    job_type : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    
    job_print_total : {
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    job_req_paper_quantity : {
        type : Sequelize.INTEGER,
        allowNull : false,
        // defaultValue : '0',
    },

    job_print_per_paper : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

    job_req_lamination : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        // defaultValue : '0',

    },

    job_req_stappled : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        // defaultValue : '0',
    },

    job_paper_cost : {
        type : Sequelize.DECIMAL(10,4),
        allowNull : false,
        // defaultValue : '0.0000'

    },

    job_print_cost : {
        type : Sequelize.DECIMAL(10,4),
        allowNull : false,
        // defaultValue : '0.0000',
    },

    item_pages : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

    
    print_pages_printer_id : {
        //From print_pages_printer table
        type: Sequelize.INTEGER,
        allowNull : false,
        defaultValue : '0',
    },

});

 print_pages.sync({ alter: true });

module.exports = print_pages