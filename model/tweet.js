//model/comments.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  text: String,
  pubstatus: Boolean,
  publishedTweetId: String

});

module.exports = TweetSchema;
