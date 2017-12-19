  //server.js
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Tweet = require('./model/tweetstorm');

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

router.route('/tweets')
  .get(function(req, res) {
    Tweet.find(function(err, tweets) {
      if (err)
        res.send(err);
      res.json(tweets)
    });
  })
  .post(function(req, res) {
    var tweet = new Tweet();
    tweet.text = req.body.text;
    tweet.id = req.body._id;
    tweet.save(function(err, tweet) {
      if (err)
        res.send(err);
        res.json({ 
          id: tweet.id,
          message: 'Tweet successfully added!' 
        });
      });
    })

router.route('/tweets/:tweet_id')
  .put(function(req, res) {
    Tweet.findById(req.params.tweet_id, function(err, tweet) {
      if (err)
        res.send(err);
      (req.body.text) ? tweet.text = req.body.text : null;
      tweet.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Tweet has been updated' });
      });
    });
  })
  .delete(function(req, res) {
    Tweet.remove({_id: req.params.tweet_id}, function (err, tweet) {
      if (err)
        res.send(err);
      res.json({ message: 'Tweet has been deleted' })
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
