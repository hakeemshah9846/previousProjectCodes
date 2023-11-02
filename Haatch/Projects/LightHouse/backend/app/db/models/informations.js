const mongoose = require('mongoose');

const informations = new mongoose.Schema({
  title: 'string',
  data: 'string',
})

module.exports = mongoose.model('informations', informations);