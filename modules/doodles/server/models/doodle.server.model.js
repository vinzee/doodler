'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Doodle Schema
 */
var DoodleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Doodle name',
    trim: true
  },
  json: {
    type: Object,
    default: {},
    required: 'Please fill in the JSON',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Doodle', DoodleSchema);
