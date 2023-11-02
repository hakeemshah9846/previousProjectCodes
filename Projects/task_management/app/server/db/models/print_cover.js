const { Sequelize } = require("sequelize");

const sequelize = require("../db-conn");

const jobs = require('./job_profile');

const print_cover = sequelize.define("print_cover", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  job_id: {
    //jobId
    //From jobs table sent through req body
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  dev_flag : {
    type : Sequelize.BOOLEAN,
  },

  print_cover_operator_id: {
    //printCover_operator
    //From operators table
    type: Sequelize.STRING,
    allowNull: false,
    // defaultValue : '0',
  },

  request_date: {
    //printCover_rqstDate
    type: Sequelize.STRING,
    allowNull: false,
    // defaultValue : '0000-00-00 00:00:00',
  },

  completed_date: {
    //printCover_completeDate
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue : '0000-00-00 00:00:00',
    // defaultValue : '0000-00-00 00:00:00',
  },

  print_cover_status_id: {
    //printCover_status
    // Replace with From print_cover_statuses table
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  print_cover_material_id: {
    //printCover_material
    type: Sequelize.STRING,
    allowNull: false,
    // defaultValue : '0',
  },

  print_cover_quantity: {
    //printCover_quantity
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  print_cover_sides : {
    //printCover_sides
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  //Here
  print_cover_color_id: {
    //printCover_color
    //Replace with id from print_cover_colors table
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  printCover_laminate: {
    //printCover_laminate {1,2}
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue : '0',
  },

  require_lamination : {
    //true or false
    type : Sequelize.BOOLEAN,
    allowNull : false,
    defaultValue : false,
  },

  print_cover_machine_id: {
    //printCover_Machine
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },


  print_cover_printer_id: {

    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue : '0',
  },

  print_cover_paper_type_id: {

    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue : '0',
  },
});



print_cover.sync({ alter: true });

module.exports = print_cover;
