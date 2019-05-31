'use strict'
const mongoose = require('mongoose');
const timeLib = require('../libs/timeLib')
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdOn :{
    type:Date,
    default: timeLib.now()
  }
})

mongoose.model('User', userSchema);