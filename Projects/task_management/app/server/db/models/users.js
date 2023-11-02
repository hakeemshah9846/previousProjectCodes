const {Sequelize} = require('sequelize');
const sequelize = require('../db-conn');
const user_roles_connection = require('./user_roles_connection');
// const user_roles_connection = require('./user_roles_connection');
// const user_roles = require('./user_roles');


const users =  sequelize.define("users",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    first_name : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    last_name : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    email : {
        type: Sequelize.STRING,
        allowNull : false,
    },
    
    image : {
        //id from images table
        type: Sequelize.STRING,
    
    },

    phone : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    // department_id : {
    //     //id from department table
    //     type : Sequelize.INTEGER,
    //     allowNull : false,
    // },

    // section_id : {
    //     //id from section table
    //     type : Sequelize.INTEGER,
    //     allowNull : false,
    // },

    // branch_id : {
    //     type : Sequelize.STRING,
    //     allowNull : false,
    // },

    password : {
        type: Sequelize.STRING,
        allowNull : false,
    },

    isOperator : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    },

    //From operators table
    operator_id : {
        type : Sequelize.INTEGER,
        
    },

    isSupervisor : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    },


    // otp : {
    //     type : Sequelize.STRING,
    //     allowNull : false,
    // },

    // otp_status : {
    //     type : Sequelize.STRING,
    //     allowNull : false
    // },

    password_changed : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    },
    
    new_user : {
        type : Sequelize.STRING,
        allowNull : false,
    },

    forgot_password_token : {
        type : Sequelize.STRING
    }

}, {
    paranoid : true,
});

users.hasMany(user_roles_connection, { foreignKey: 'user_id' });

user_roles_connection.belongsTo(users, { foreignKey: 'user_id' });
//do not use this in production
 users.sync({ alter: true });

module.exports = users
