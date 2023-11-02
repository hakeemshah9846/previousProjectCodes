const mongoose = require('mongoose');

const socialMedias = new mongoose.Schema({
  title: { type: 'string', required: true },
  icon: { type: 'string', required: true },
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('social_medias', socialMedias);