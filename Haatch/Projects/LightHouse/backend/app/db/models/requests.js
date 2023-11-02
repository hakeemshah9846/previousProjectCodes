const mongoose = require('mongoose');

const requests = new mongoose.Schema({
  type: 'string',
  change_from: 'string',
  change_to: 'string',
  status: 'string',
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('requests', requests);