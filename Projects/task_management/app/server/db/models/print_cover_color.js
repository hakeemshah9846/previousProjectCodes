//Model to store binding operators in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const print_covers = require('./print_cover');


const print_cover_colors = sequelize.define("print_cover_colors", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  print_cover_color: {
    type: Sequelize.STRING,
    allowNull: false,
    // defaultValue : '',
  },
});

print_cover_colors.hasMany(print_covers, { foreignKey: 'print_cover_color_id' });

print_covers.belongsTo(print_cover_colors, { foreignKey: 'print_cover_color_id' });


print_cover_colors.sync({ alter : true });

module.exports = print_cover_colors