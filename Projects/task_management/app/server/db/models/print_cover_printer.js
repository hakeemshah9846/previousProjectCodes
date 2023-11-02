//Model to store binding operators in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const print_cover_printer = sequelize.define("print_cover_printer", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  printer: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

print_cover_printer.sync({ alter : true });

module.exports = print_cover_printer

