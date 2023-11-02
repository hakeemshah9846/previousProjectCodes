//In Print Pages section
const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const print_pages = require('./print_pages');


const print_pages_colors = sequelize.define("print_pages_colors", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  job_print_color: {
    type: Sequelize.STRING,
    allowNull: false,
    // defaultValue : '',
  },
});


print_pages_colors.hasMany(print_pages, { foreignKey: 'job_print_color_id' });

print_pages.belongsTo(print_pages_colors, { foreignKey: 'job_print_color_id' });

print_pages_colors.sync({ alter : true });

module.exports = print_pages_colors