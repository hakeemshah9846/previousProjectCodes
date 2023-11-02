//Model to store requested_by and requested_to entries in UI images

const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');
const job_profile = require('./job_profile');


const request_profile = sequelize.define("request_profile", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  dev_flag : {

    type : Sequelize.BOOLEAN,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue : '',
  },

  image : {
    type : Sequelize.STRING,
    allowNull : false,
    defaultValue : "No Image",
  },

  department_id : {
    //{Replace with id from departments table}
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : '0',
  },

  campus_id: {
    //{Replace with id from campuses table}
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : '0',
  },

  email : {
    type : Sequelize.STRING,
    allowNull : false,
    // unique : true,
    defaultValue : '',
  },

  section_id : {
    //{Replace with id from sections table}
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : '0',
  },

  contact_no : {
    type : Sequelize.STRING,
    allowNull : false,
    // unique : true,
    defaultValue : '',
  },

  user_id : {
    //From users table
    type : Sequelize.INTEGER,
    defaultValue : null,
  }

},
{
  paranoid : true
});

// Define associations
// request_profile.hasMany(job_profile, { foreignKey: 'requested_by_id' });
// User.hasMany(Post, { foreignKey: 'editorId' });
// job_profile.belongsTo(request_profile, { foreignKey: 'requested_by_id' });
// Post.belongsTo(User, { foreignKey: 'editorId' });

request_profile.sync({ alter : true });

module.exports = request_profile


