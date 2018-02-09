//model/comments.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  twitterProvider: {
    type: {
      id: String, 
      token: String
    }
  }
});

UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, callback) {

  /* Copy-pasted from https://medium.com/@robince885/how-to-do-twitter-authentication-with-react-and-restful-api-e525f30c62bb */
  /* Leaving that = this in for now, although I don't understand it. TODO:
   * figure out what that = this does and why. */
  var that = this;

  return this.findOne({
    'twitterProvider.id' : profile.id
  }, function(err, user) {
    if (!user) {
      var newUser = new that({
        twitterProvider: {
          id: profile.id,
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
