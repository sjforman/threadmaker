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
var twitter = require('twitter');
var dotenv = require('dotenv').config();
var path = require('path');

var Thread = require('./model/thread');
var Tweet = require('./model/tweet');
var User = require('./model/user');

var app = express();
var router = express.Router();

var port = process.env.REACT_APP_API_PORT || 3001;
var passportConfig = require('./passport');
var corsOption = {
  origin: true,
  moethods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

app.use(express.static(path.join(__dirname, 'build')));


app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

var getAvatarUrl = function(req, res, next) {
  request.get({
    url: 'https://api.twitter.com/1.1/users/show.json',
    qs: { screen_name: req.body.screen_name },
    oauth: { 
      consumer_key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET,
    }
  }, function (err, r, body) {
    if (err) {
      return res.send(500, { message: err.message });
    }
    else {
      const parsedBody = JSON.parse(r.body);
      var avatarUrl = parsedBody.profile_image_url_https;
      req.body.avatarUrl = avatarUrl;
      return next();
    }
  });
}

var generateToken = function(req, res, next) {
  req.token = createToken(req.auth);
  return next();
}

var sendToken = function(req, res) {
  res.set({
    'x-auth-token': req.token
  });
  req.user.twitterProvider.oauth_verifier = req.body.oauth_verifier;
  req.user.twitterProvider.avatarUrl = req.body.avatarUrl;
  return res.status(200).send(JSON.stringify(req.user));
}


/* TODO: tokens expire after 15 minutes. How to handle? */

var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    //var oauth_callback = process.env.REACT_APP_API_URL;
    //console.log(oauth_callback);
    //var oauth_callback = 'http://localhost:3000';
    var oauth_callback = process.env.REACT_APP_URL;
    console.log(oauth_callback);
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        callback: oauth_callback,
        consumer_key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      else if (r.statusCode === 400) {
        return res.status(500).send({ message: r.body });
      }
      else {
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      }
    });
  });

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
      oauth: {
        consumer_key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET,
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
      req.body['oauth_verifier'] = req.query.oauth_verifier;
      req.body['user_id'] = parsedBody.user_id;
      req.body['screen_name'] = parsedBody.screen_name;

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
  }, getAvatarUrl, generateToken, sendToken);


router.route('/threads')
  .get(authenticate, function(req, res) {
    Thread.find(
      {userId: req.headers.userid},
      function(err, threads) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(threads)
      }
    });
  })
  .post(authenticate, function(req, res) {
    var thread = new Thread();
    thread.id = req.body._id;
    thread.userId = req.headers.userid;
    thread.pubstatus = false;
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
  .get(authenticate, function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(thread)
      }
    });
  })
  .put(authenticate, function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        var tweet = thread.tweets.id(req.params.tweet_id);
        tweet.text = req.body.text;
        tweet.pubstatus = req.body.pubstatus;
        tweet.publishedTweetId = req.body.publishedTweetId;
          thread.save(function(err) {
            if (err) {
              res.send(err);
            }
            else {
              res.json({ message: 'Tweet has been updated.' });
            }
          });
        }
      });
    })
  .delete(authenticate, function(req, res) {
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
  .get(authenticate, function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(thread);
      }
    });
  })
  .post(authenticate, function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        thread.tweets.push({
          text: '',
          prefix: req.body.prefix,
          postfix: req.body.postfix,
          pubstatus: false,
          publishedTweetId: ''
        });
        thread.save(function(err) {
          if (err) {
            res.send(err)
          }
          else {
            res.json({
              /* The last tweet in the thread is the one just added. */
              tweet_id: thread.tweets[thread.tweets.length - 1]._id,
              message: 'Tweet successfully added to thread.'
            });
          }
        });
      }
    });
  })
  .put(authenticate, function(req, res) {
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err)
      }
      else {
        thread.pubstatus = req.body.pubstatus;
        thread.tweets = req.body.tweets;
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
  .delete(authenticate, function(req, res) {
    Thread.remove({_id: req.params.thread_id}, function (err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'Thread has been deleted' })
      }
    })
  })

router.route('/publish')
  .post(authenticate, (req, res) => {
    var twitterClient = new twitter({
      consumer_key: process.env.REACT_APP_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.REACT_APP_TWITTER_CONSUMER_SECRET,
      access_token_key: req.headers.oauthtoken,
      access_token_secret: req.headers.oauthsecret
    });
    twitterClient.post('statuses/update', 
      {
        status: req.body.tweet.prefix + req.body.tweet.text + req.body.tweet.postfix,
        in_reply_to_status_id: req.body.parentId,
        auto_populate_reply_metadata: true
      }, function(error, tweet, response) {
      if (error) {
        console.log(error);
        res.send(error)
      }
      else {
        res.json({
          /* TODO: parse the response to just grab what's needed
           * rather than sending everything to the client */
          responseBody: response,
          message: 'Tweet has been tweeted'
        });
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
var mongoDB = process.env.REACT_APP_DB_URL

var mongoConnectionString =
  process.env.REACT_APP_DB_PROTOCOL + '://' +
  process.env.REACT_APP_DB_USER + ':' +
  process.env.REACT_APP_DB_PASS + '@' +
  process.env.REACT_APP_DB_URI + '/' +
  process.env.REACT_APP_DB_NAME;

mongoose.connect(mongoConnectionString, { useMongoClient: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
