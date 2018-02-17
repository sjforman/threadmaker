//model/comments.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tweets = require('./tweet.js');

var ThreadSchema = new Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tweets: [Tweets]
});

module.exports = mongoose.model('Thread', ThreadSchema);
