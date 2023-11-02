const mongoose = require('mongoose');

const users = new mongoose.Schema({
  first_name: 'string',
  last_name: 'string',
  short_name: 'string',
  image: 'string',
  description: 'string',
  gender: 'string',
  phone: 'string',
  email: { type: 'string', required: true, unique: true },
  password: { type: 'string', required: true },
  occupation: 'string',
  date_of_birth: 'string',
  birth_place: 'string',
  father_name: 'string',
  country: 'string',
  passport: {
    code: 'string',
    number: 'string',
    files: [
      {
        title: 'string',
        url: 'string'
      }
    ],
    issued_region: 'string',
    issue_date: 'string',
    expiry_date: 'string',
    passport_authority: 'string',
    passport_code_authority: 'string',
  },
  social_media: [
    {
      platform: { type: mongoose.Schema.Types.ObjectId, ref: 'social_medias' },
      url: 'string',
      username: 'string',
      label: 'string'
    }
  ],
  type: 'string',
  account_type: 'string',
  level: 'string',
  verified: 'boolean',
  secrets: {
    registration: {
      otp: 'string',
      expiry: 'string'
    },
    payments: {
      otp: 'string',
      expiry: 'string'
    },
    password_token: 'string'
  },
  payment_templates: [
    {
      platform: { type: mongoose.Schema.Types.ObjectId, ref: 'payment_platforms' },
      platform_data: {}
    }
  ],
  status: { type: 'string', required: true },
  user_policy: {
    title: 'string',
    url: 'string',
  },
  inn:{
    number: 'number',
    data: 'string'
  },
  supporting: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  public_email: 'string',
  last_login: 'string',
  added_on: 'string',
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updated_on: 'string',
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  deleted_on: 'string',
  deleted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('users', users);