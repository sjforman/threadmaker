//model/comments.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
  text: String
});

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var ThreadSchema = new Schema({
  tweets: [TweetSchema]
});

//export our module to use in server.js
module.exports = mongoose.model('Thread', ThreadSchema);
