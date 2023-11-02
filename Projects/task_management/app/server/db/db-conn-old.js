require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize_old = new Sequelize(process.env.MYSQL_DATABASE_OLD, process.env.MYSQL_USER, process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    logging: false
});

module.exports =  sequelize_old;