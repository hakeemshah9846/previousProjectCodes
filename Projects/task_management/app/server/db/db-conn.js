require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    logging: false
});

module.exports =  sequelize;


// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_ROOT_PASSWORD, {
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     dialect: 'mysql',
//     logging: false,
//     define: {
//         timestamps: false
//       },
//       pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//       },
//       // Set the timeout value to 30 seconds
//   dialectOptions: {
//     connectTimeout: 30000
//   }
// });

// module.exports =  sequelize;