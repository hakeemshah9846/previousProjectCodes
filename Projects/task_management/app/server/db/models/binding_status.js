//Model to store binding status in finishing and binding section

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const finishing_and_bindings = require('./finishing_and_bindings');


const binding_status = sequelize.define("binding_status", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue : ''
  },
});

binding_status.hasMany(finishing_and_bindings, { foreignKey: 'binding_status_id' });

finishing_and_bindings.belongsTo(binding_status, { foreignKey: 'binding_status_id' });

binding_status.sync({ alter : true });

module.exports = binding_status