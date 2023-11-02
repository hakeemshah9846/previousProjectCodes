const { Sequelize } = require("sequelize");

const sequelize = require("../db-conn");

const finishing_and_bindings = sequelize.define("finishing_and_bindings", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  dev_flag : {
    type : Sequelize.BOOLEAN,

  },

  job_id: {
    //from jobs table , id sent through req body from front-end
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  binding_operator_id: {
    //From binding_operators table
        //Convert this to integer format after converting the column value to integer format using raw sql query

    type: Sequelize.STRING,
    allowNull: false,
  },

  binding_type_id: {
    //From binding_types table
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  binding_status_id: {
    //From binding status table
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  material_id: {
    //From materials table
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  binding_page_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  binding_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  require_perforation: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

  request_date: {
    //When finishing_and binding is requested
    //Convert this to date format after converting the column value to date format using raw sql query
    type: Sequelize.STRING,
    // allowNull: false,
  },
  
  completed_date: {
        //Convert this to date format after converting the column value to date format using raw sql query
    type: Sequelize.STRING,
  },

  unit_cost: {
    // From binding_unit_costs table
    type: Sequelize.DECIMAL(14,4),
    allowNull: false,
  },


});

// sequelize.query("ALTER TABLE finishing_and_bindings MODIFY unit_cost DECIMAL(14, 4);")
//   .then(() => console.log("Column type changed successfully"))
//   .catch(err => console.error("Error altering column type: ", err));


// finishing_and_bindings.sync({alter : true});

module.exports = finishing_and_bindings
