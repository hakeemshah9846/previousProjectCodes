const mongoose = require('mongoose');

const collections = new mongoose.Schema({
  purpose: { type: 'string', required: true },
  description: { type: 'string', required: true },
  featured_image: {
    title: 'string',
    url: 'string',
  },
  featured_video: {
    title: 'string',
    url: 'string',
  },
  files: [
    {
      title: 'string',
      url: 'string',
    }
  ],
  curators: [
    {
      curator: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      status: { type: 'string', required: true },
      video: {
        title: 'string',
        url: 'string',
      },
      added_on: 'string',
      added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      updated_on: 'string',
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    }
  ],
  payment_templates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users.payment_templates' }],
  status: { type: 'string', required: true },
  updates: [
    {
      status: 'string',
      video: {
        title: 'string',
        url: 'string',
      },
      files: [
        {
          title: 'string',
          url: 'string',
        }
      ],
      description: { type: 'string', required: true },
      amount: { type: 'number', required: true },
      extra_amount: 'number',
      update_id: 'number',
      added_on: 'string',
      added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      updated_on: 'string',
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      deleted_on: 'string',
      deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    }
  ],
  target_amount: 'number',
  collected_amount: 'number',
  updated_data: { type: mongoose.Schema.Types.ObjectId, ref: 'updated_collections' },
  permalink: 'string',
  payment_purpose: 'string',
  otp: {
    code: 'number',
    expiry: 'string'
  },
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('collections', collections);