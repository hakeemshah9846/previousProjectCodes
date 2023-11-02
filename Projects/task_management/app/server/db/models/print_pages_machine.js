//Model to store binding operators in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const print_pages_machines = sequelize.define("print_pages_machines", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  machine: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

print_pages_machines.sync({ alter : true });

module.exports = print_pages_machines