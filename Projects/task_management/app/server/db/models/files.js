const {Sequelize, DataTypes} = require('sequelize');

// const { Sequelize } = require("sequelize");

const sequelize = require('../db-conn');


const files = sequelize.define("files", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  user_id : {

    type : DataTypes.INTEGER,
    allowNull : false,

  },

  type: {
    type: DataTypes.STRING,
  },

  name: {
    type: DataTypes.STRING,
  },

  data: {
    type: DataTypes.STRING,
    allowNull : false,
  },

});

        files.sync({ alter : true });

module.exports = files


// module.exports = (sequelize, DataTypes) => {
//   const images = sequelize.define("images", {
//     type: {
//       type: DataTypes.STRING,
//     },
//     name: {
//       type: DataTypes.STRING,
//     },
//     data: {
//       type: DataTypes.BLOB("long"),
//     },
//   });

//   return images;
// };


// images.sync({ alter : true });
