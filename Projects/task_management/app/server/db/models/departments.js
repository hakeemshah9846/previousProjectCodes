const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const job_profile = require('./job_profile');
const request_profile = require('./request_profile');


const departments = sequelize.define("departments", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  department: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue : '',
    // unique : true,
  },

});

// departments.hasMany(job_profile, { foreignKey: 'requested_by_department_id' });

// job_profile.belongsTo(departments, { foreignKey: 'requested_by_department_id' });

departments.hasMany(request_profile, { foreignKey: 'department_id' },{as : "department"});

request_profile.belongsTo(departments, { foreignKey: 'department_id' }, {as : "department"});


        departments.sync({ alter : true });

module.exports = departments