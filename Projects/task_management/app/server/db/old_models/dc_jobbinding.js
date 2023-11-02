const sequelize = require('../db-conn-old');
const {Sequelize} = require('sequelize');


const dc_jobbinding = sequelize.define("dc_jobbinding", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  
    jobid: {// Changed (id)
      //from jobs table , id sent through req body from front-end
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  
    binding_operator: { //Changed
      //From binding_operators table
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    binding_type: { //Changed
      //From binding_types table
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    binding_status: { //Changed
      //From binding status table
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    // material_id: {
    //   //From materials table
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
  
    binding_pagecount: { //Changed
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  
    binding_quantity: { //Changed
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  
    binding_reqPerforation: { // Changed
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  
    binding_material: { //Changed
      // From binding_materials table
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    binding_jobCost: { //Changed
      // From binding_unit_costs table
      type: Sequelize.DECIMAL(10, 4),
      allowNull: false,
    },
  
    binding_rqstdate: { //Changed
      type: Sequelize.STRING,
      allowNull: false,
    },
  
    binding_completedate: { //Changed
      type: Sequelize.STRING,
    },
  },{
    timestamps : false
  });
  
  dc_jobbinding.sync({ alter: true });
  
  module.exports = dc_jobbinding