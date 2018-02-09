//model/comments.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  text: String
});

var ThreadSchema = new Schema({
  tweets: [TweetSchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
