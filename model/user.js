//model/comments.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  twitterProvider: {
    type: {
      id: String, 
      screen_name: String,
      token: String
    }
  }
});

UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, callback) {

  /* when mongoose calls upsertTwitterUser, it probably calls
   * upserTwitterUser.bind(UserSchema). See what mongoose says about what it
   * binds when it calls that function */

  /* "this" object seems to be constructor for the user schema? */
  /* TODO: try `new UserSchema` instead - does it break? why? */

  var that = this;

  return this.findOne({
    'twitterProvider.id' : profile.id
  }, function(err, user) {
    if (!user) {
      var newUser = new that({
        twitterProvider: {
          id: profile.id,
          screen_name: profile.username,
          token: token, 
          tokenSecret: tokenSecret
        }
      });
      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return callback(error, savedUser);
      });
    }  else {
    return callback(err, user);
    }
  });
}

//export our module to use in server.js
module.exports = mongoose.model('User', UserSchema);
