const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const delivery_modes = sequelize.define("delivery_modes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  delivery_mode: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue : '',
  },
});

delivery_modes.sync({ alter : true });

module.exports = delivery_modes