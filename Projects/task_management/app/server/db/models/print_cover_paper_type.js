//Model to store binding operators in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const print_cover_paper_type = sequelize.define("print_cover_paper_type", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  paper_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

print_cover_paper_type.sync({ alter : true });

module.exports = print_cover_paper_type

