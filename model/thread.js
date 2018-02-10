//model/comments.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TweetSchema = require('./tweet.js');

var TweetSchema = new Schema({
  text: String
});

var ThreadSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tweets: [TweetSchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
