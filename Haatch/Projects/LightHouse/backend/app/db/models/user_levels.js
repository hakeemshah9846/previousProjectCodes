const mongoose = require('mongoose');

const userLevels = new mongoose.Schema({
  label: 'string',
  value: 'number',
})

module.exports = mongoose.model('user_levels', userLevels);