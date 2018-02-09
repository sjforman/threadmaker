 //server.js
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var request = require('request');
var cors = require('cors');

var twitterConfig = require('./twitter.config.js');

var Tweet = require('./model/tweet');
var Thread = require('./model/thread');
var User = require('./model/user');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOption = {
  origin: true, 
  moethods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true, 
  exposedHeaders: ['x-auth-token']
}

app.use(cors(corsOption));

var passportConfig = require('./passport');

passportConfig();

/* TODO: in production replace 'my-secret' with 
 * either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA 
 * more instructions in the library documentation */

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60*120
  });
};

var generateToken = function(req, res, next) {
  req.token = createToken(req.auth);
  return next();
}

var sendToken = function(req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
}

var authenticate = expressJwt({
  secret: 'my-secret', 
  requestProperty: 'auth', 
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.header['x-auth-token'];
    }
    return null;
  }
});

router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: twitterConfig.consumer_key,
        consumer_secret: twitterConfig.consumer_secret
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      
      res.send(JSON.parse(jsonStr));
    });
  });

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
      oauth: {
        consumer_key: twitterConfig.consumer_key,
        consumer_secret: twitterConfig.consumer_secret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    req.auth = {
      id: req.user.id
    };

    return next();
  }, generateToken, sendToken);


router.route('/threads')
  .get(function(req, res) {
    Thread.find(function(err, threads) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(threads)
      }
    });
  })
  .post(function(req, res) {
    var thread = new Thread();
    thread.id = req.body._id;
    thread.save(function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({
          id: thread.id,
          message: 'Thread successfully added!'
        });
      }
    });
  })

router.route('/threads/:thread_id/:tweet_id')
  .get(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(thread)
      }
    });
  })
  .put(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        var tweet = thread.tweets.id(req.params.tweet_id);
        (req.body.text) ? tweet.text = req.body.text : null;
          thread.save(function(err) {
            if (err) {
              res.send(err);
            }
            else {
              res.json({ message: 'Tweet has been updated.'  });
            }
          });
        }
      });
    })
  .delete(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
    if (err) {
      res.send(err);
    }
    else {
      var tweet = thread.tweets.id(req.params.tweet_id);
      tweet.remove();
      thread.save(function(err) {
          if (err) {
            res.send(err);
          }
          else {
            res.json({ message: 'Tweet successfully deleted from thread' });
          }
        });
      }
    });
  });

router.route('/threads/:thread_id')
  .get(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(thread);
      }
    });
  })
  .post(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        var tweet = new Tweet();
        tweet.text = '';
        thread.tweets.push(tweet);
        thread.save(function(err) {
          if (err) {
            res.send(err)
          }
          else {
            res.json({
              thread: thread,
              tweet_id: tweet.id,
              message: 'Tweet successfully added to thread.'
            });
          }
        });
      }
    });
  })
  .put(function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err)
      }
      else {
        thread.tweets = req.body;
        thread.save(function(err) {
          if (err) {
            res.send(err);
          }
          else {
            res.json({ message: 'Thread has been updated.'  });
          }
        });
      }
    })
  })
  .delete(function(req, res) {
    Thread.remove({_id: req.params.thread_id}, function (err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'Thread has been deleted' })
      }
    })
  })

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});

//db config
var mongoDB = 'mongodb://localhost/27017';
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
