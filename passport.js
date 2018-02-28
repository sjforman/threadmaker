//passport.js
'use strict';

var passport = require('passport');
var TwitterTokenStrategy = require('passport-twitter-token');
var User = require('mongoose').model('User');

module.exports = function() {
  passport.use(new TwitterTokenStrategy({
    consumerKey: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET
  },
  function (token, tokenSecret, profile, done) {
    User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
      return done(err, user);
    });
  }));
}
