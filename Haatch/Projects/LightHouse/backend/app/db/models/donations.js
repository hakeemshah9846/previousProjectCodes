const mongoose = require('mongoose');

const donations = new mongoose.Schema({
  _collection: { type: mongoose.Schema.Types.ObjectId, ref: 'collections' },
  amount: { type: 'number', required: true },
  status: 'string',
  payment_template: {},
  payment_response: '',
  transaction_id: 'string',
  payment_url: 'string',
  extra_amount: { type: 'boolean', default: false },
  update_id: 'number',
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('donations', donations);