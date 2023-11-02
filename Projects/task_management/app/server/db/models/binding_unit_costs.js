//Model to store unit cost in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const binding_unit_costs = sequelize.define("binding_unit_costs", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  unit_cost: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

binding_unit_costs.sync({ alter : true });

module.exports = binding_unit_costs