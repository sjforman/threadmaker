//passport.js
'use strict'

var passport = require('passport');
var TwitterTokenStrategy = require('passport-twitter-token');
var User = require('mongoose').model('User');
var twitterConfig = require('./twitter.config.js');

module.exports = function() {
  passport.use(new TwitterTokenStrategy({
    consumerKey: twitterConfig.consumer_key,
    consumerSecret: twitterConfig.consumer_secret
  },
  function (token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
      return done(err, user);
    });
  }));
}
