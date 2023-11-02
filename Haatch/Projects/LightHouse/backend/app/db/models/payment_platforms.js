const mongoose = require('mongoose');

const paymentPlatforms = new mongoose.Schema({
  title: 'string',
  icon: 'string',
  url: 'string',
  short_name: 'string',
  description: 'string',
  type: 'string',
  feilds: [{
    label: 'string',
    value: 'string',
    secure: 'boolean'
  }],
  gateway: 'string',
  payment_url: 'string',
  status_url: 'string',
  order: 'number',
  payment_process: 'string',
  status: 'string',
  allowed: ['string'],
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('payment_platforms', paymentPlatforms);