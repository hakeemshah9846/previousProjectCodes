//Model to store binding operators in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const print_covers = require('./print_cover');


const print_cover_status = sequelize.define("print_cover_status", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

print_cover_status.hasMany(print_covers, { foreignKey: 'print_cover_status_id' });

print_covers.belongsTo(print_cover_status, { foreignKey: 'print_cover_status_id' });

print_cover_status.sync({ alter : true });

module.exports = print_cover_status