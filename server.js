  //server.js
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Tweet = require('./model/tweet');
var Thread = require('./model/thread');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

router.route('/threads')
  .get(function(req, res) {
    Thread.find(function(err, threads) {
      if (err) {
        console.log('error in finding threads');
        res.send(err);
      }
      else {
        res.json(threads)
      }
    });
  })
  .post(function(req, res) {
    var thread = new Thread();
    thread.text = req.body.text;
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


router.route('/tweets')
  .get(function(req, res) {
    Tweet.find(function(err, tweets) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(tweets)
      }
    });
  })
  .post(function(req, res) {
    var tweet = new Tweet();
    tweet.text = req.body.text;
    tweet.id = req.body._id;
    tweet.save(function(err, tweet) {
      if (err) {
        res.send(err);
      }
      else {
          res.json({ 
            id: tweet.id,
            message: 'Tweet successfully added!' 
          });
        }
      });
    })

router.route('/threads/:thread_id')
  .get(function(req, res) {
    console.log(req.params.thread_id);
    Thread.findById(req.params.thread_id, function(err, thread) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(thread)
      }
    });
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

router.route('/tweets/:tweet_id')
  .put(function(req, res) {
    Tweet.findById(req.params.tweet_id, function(err, tweet) {
        if (err) {
          res.send(err);
        }
        else {
          (req.body.text) ? tweet.text = req.body.text : null;
          tweet.save(function(err) {
            if (err) {
              res.send(err);
            }
            else {
              res.json({ message: 'Tweet has been updated' });
            }
          });
        }
      });
    })
  .delete(function(req, res) {
    Tweet.remove({_id: req.params.tweet_id}, function (err, tweet) {
      if (err) {
        res.send(err);
      }
      else {
        res.json({ message: 'Tweet has been deleted' })
      }
    })
  });

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
