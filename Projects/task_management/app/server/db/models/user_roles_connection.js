//This table acts as an interconnection between user table and user_type table

const { Sequelize } = require('sequelize');
const sequelize = require('../db-conn');
const {Model} = require('sequelize');
const user_roles = require('./user_roles');
const users = require('./users');

const user_roles_connection=  sequelize.define("user_roles_connection",{

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id:{

        //id from users table
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    role_id:{
        //id from user_types table
        type: Sequelize.INTEGER,
        allowNull: false,
    },

},
{
    paranoid : true,
});


// user_roles.belongsTo(users, {
//     foreignKey: 'user_id',
//     as: 'user'
//   });

//   users.hasMany(user_roles, { 
//     foreignKey : "user_id",
//     sourceKey : 'id' 
//   });
  
//   user_roles.belongsTo(user_types, {
//     foreignKey: 'user_type_id',
//     as: 'user_type'
//   });
  
//   user_types.hasMany(user_roles, { 
//     foreignKey : "user_type_id",
//     sourceKey : 'user_type' 
//   });

//do not use this in production

user_roles.hasMany(user_roles_connection, { foreignKey: 'role_id' });

user_roles_connection.belongsTo(user_roles, { foreignKey: 'role_id' });

// user_roles_connection.sync({ alter: true });

module.exports = user_roles_connection