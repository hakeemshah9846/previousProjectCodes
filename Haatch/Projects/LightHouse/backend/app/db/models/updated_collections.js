const mongoose = require('mongoose');

const updatedCollections = new mongoose.Schema({
  _collection: { type: mongoose.Schema.Types.ObjectId, ref: 'collections' },
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
  status: { type: 'string', required: true },
  target_amount: 'number',
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('updated_collections', updatedCollections);