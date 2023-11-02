const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');

const finishing_and_bindings = require('./finishing_and_bindings');


const materials = sequelize.define("materials", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

   name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  type : {
    type : Sequelize.STRING,
    allowNull : false
  },

  cost : {
    type : Sequelize.STRING,
    allowNull : false
  }

});


// materials.hasMany(finishing_and_bindings, { foreignKey: 'binding_status_id' });

// finishing_and_bindings.belongsTo(materials, { foreignKey: 'binding_status_id' });

// materials.hasMany(finishing_and_bindings, { foreignKey: 'material_id' });

// finishing_and_bindings.belongsTo(materials, { foreignKey: 'material_id' });


 materials.sync({ alter: true });

module.exports = materials