const { Sequelize } = require("sequelize");

const sequelize = require("../db-conn");
const printers = require("./printers");
const papers = require("./papers");

const printer_papers = sequelize.define("printer_papers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  printer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },

  paper_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // defaultValue : '0',
  },
});


papers.hasMany(printer_papers, { foreignKey: 'paper_id' });

printer_papers.belongsTo(papers, { foreignKey: 'paper_id' });


// printer_papers.sync({ alter: true });

module.exports = printer_papers
