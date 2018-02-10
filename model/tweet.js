//model/comments.js
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  text: String
});

module.exports = mongoose.model('Tweet', TweetSchema);
