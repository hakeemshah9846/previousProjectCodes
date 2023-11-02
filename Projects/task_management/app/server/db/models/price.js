const {Sequelize} = require('sequelize');

const sequelize = require('../db-conn');


const price =  sequelize.define("price",{

id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    paperType : {
        //paperType
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    printerType : {
        //printerType
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    printOnesideBW : {
        //printOnesideBW
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    printTwosideBW : {
        //printTwosideBW
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    printOnesideC : {
        //printOnesideC
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    },

    printTwosideC : {
        //printTwosideC
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : '',
    }

});

 price.sync({ force: true });

module.exports = price