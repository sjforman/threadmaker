import React from 'react';
import axios from 'axios';
import { Tweet } from './Tweet';
import { Header } from './Header';

class ThreadContainer extends React.Component {
  render() {
    return (
    <div>
      <Header />
      <div id="buttons" className="tc mb4">
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.addTweet}>
        Add tweet
        </button>
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.publishThread}>
        Publish thread
        </button>
      </div>
      <div>
        {this.props.children}
      </div>
    </div>
    );
  }
}

export class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characterLimit: '280',
      tweets: [],
      jwtToken: localStorage.getItem('jwtToken'),
      threadId: this.props.thread_id
    };

    this.loadTweetsFromServer = this.loadTweetsFromServer.bind(this);
    this.onAddTweet = this.onAddTweet.bind(this);
    this.onDeleteTweet = this.onDeleteTweet.bind(this);
    this.onPublishTweet = this.onPublishTweet.bind(this);
    this.onPublishThread = this.onPublishThread.bind(this);
    this.handleTweetEdit = this.handleTweetEdit.bind(this);
    this.moveTweetDown = this.moveTweetDown.bind(this);
    this.moveTweetUp = this.moveTweetUp.bind(this);
  }

  loadTweetsFromServer() {
    axios( { method: 'GET', url: `${this.props.url}/${this.state.threadId}`,
      headers: { 'x-auth-token': this.state.jwtToken }
    })
      .then(res => {
        this.setState({ tweets: res.data.tweets })
      })
      .catch(err => {
        console.error(err);
      })
  }

  onAddTweet() {
    /* is it necessary to initialize this var here? */
    var array = this.state.tweets;
    axios.post(
        `${this.props.url}/${this.state.threadId}`,
        {},
        { 'x-auth-token': this.state.jwtToken }
    )
    .then(res => {
      var tweet = {
        _id: res.data.tweet_id,
        key: res.data.tweet_id,
        text: '',
        pubstatus: false,
        publishedTweetId: ''
      }
      array.push(tweet)
      this.setState({tweets: array})
    })
    .catch(err => {
      console.error(err);
    })
  }

  onDeleteTweet(index, e) {
    /* feels wrong to re-declare threadid in each function
     * like there should be some way to declare once?
     * Maybe it should be passed into the function as an argument? */
    var threadid = this.state.threadId;
    var array = this.state.tweets;
    var tweetid = this.state.tweets[index]._id;
    array.splice(index, 1);
    this.setState({tweets: array})
    /* TODO: would it be better to `put` the thread instead of
     * deleting the specific tweet? */
    axios.delete(
      `${this.props.url}/${threadid}/${tweetid}`,
      { 'x-auth-token': this.state.jwtToken }
    )
      .catch(err => {
        console.error(err);
      });
  }

  handleTweetEdit(index, e) {
    var tweet = this.state.tweets[index];
    var tweetid = tweet._id;
    var newText = e.target.value;
    var newTweet = {
      key: tweetid,
      _id: tweetid,
      text: newText,
      pubstatus: tweet.pubstatus,
      publishedTweetId: tweet.publishedTweetId
    }
    var array = this.state.tweets
    array.splice(index, 1, newTweet)
    this.setState({tweets: array});
    axios.put(
        `${this.props.url}/${this.state.threadId}/${tweetid}`,
        newTweet,
        { 'x-auth-token': this.state.jwtToken }
      )
      .catch(err => {
        console.error(err);
      });
  }

  moveTweetUp(index, e) {
    if (index > 0) {
      var threadid = this.state.threadId;
      var array = this.state.tweets;
      var tweetToMove = array[index];
      array[index] = array[index - 1];
      array[index - 1] = tweetToMove;
      this.setState({tweets: array});
      axios.put(
        `${this.props.url}/${threadid}`,
        array,
        { 'x-auth-token': this.state.jwtToken }
      )
        .catch(err => {
          console.error(err);
        });
    }
  }

  moveTweetDown(index, e) {
    if (index + 1 < this.state.tweets.length) {
      var threadid = this.state.threadId;
      var array = this.state.tweets;
      var tweetToMove = array[index];
      array[index] = array[index + 1];
      array[index + 1] = tweetToMove;
      this.setState({tweets: array});
      axios.put(
        `${this.props.url}/${threadid}`,
        array,
        { 'x-auth-token': this.state.jwtToken }
      )
        .catch(err => {
          console.error(err);
        });
    }
  }

  onPublishThread() {
    var numTweetsToPublish = this.state.tweets.length;
    var indexOfTweet = 0;
    var numTweetsPublished = 0;

    var that = this;

    /* call onPublishTweet with index = 0 and null parentId,
     * and give it a callback that increments the index and
     * counter, and in turn calls onPublishTweet again, with
     * itself as the callback. */

    var callback = function(id) {
      indexOfTweet++;
      numTweetsPublished++;
      if (numTweetsPublished < numTweetsToPublish) {
        that.onPublishTweet(indexOfTweet, null, id, callback)
      }
      /* TODO: Handle the case where one of them fails. */
    }
    that.onPublishTweet(indexOfTweet, null, null, callback);
  }

  onPublishTweet(index, e, parentId, callback) {
    let tweet = this.state.tweets[index];
    let tweetArray = this.state.tweets;
    let jwtToken = this.state.jwtToken;
    let oauthToken = localStorage.getItem('oauthToken');
    let oauthSecret = localStorage.getItem('oauthSecret');
    var that = this;
    axios({
        method: 'POST',
        url: 'http://localhost:3001/api/publish',
        data:  {
          tweet: tweet,
          parentId: parentId
        },
        headers: { 'x-auth-token': jwtToken,
          'oauthToken' : oauthToken,
          'oauthSecret' : oauthSecret
        }
      })
      .then(function(response) {
        /* TODO: handle the cases where response is not "all good" */
        let publishedTweetId = JSON.parse(response.data.responseBody.body).id_str;
        tweetArray[index].pubstatus = 'published';
        tweetArray[index].publishedTweetId = publishedTweetId;
        that.setState({tweets: tweetArray});
        axios.put(
          `${that.props.url}/${that.state.threadId}/${tweet._id}`,
          tweetArray[index],
          { 'x-auth-token': that.state.jwtToken }
        )
        .catch(err => {
          console.error(err);
        });
        if (callback) {
          callback(publishedTweetId);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.loadTweetsFromServer();
  }

  render() {

    var tweets = this.state.tweets.map((tweet, index) => {
      return (
        <Tweet
          key={tweet._id}
          id={tweet._id}
          index={index}
          text={tweet.text}
          pubStatus={tweet.pubstatus}
          publishedTweetId={tweet.publishedTweetId}
          screenName={localStorage.getItem('screenName')}
          deleteTweet={this.onDeleteTweet.bind(this, index)}
          onPublishTweet={this.onPublishTweet.bind(this, index)}
          handleTweetEdit={this.handleTweetEdit.bind(this, index)}
          characterLimit={this.state.characterLimit}
          moveTweetDown={this.moveTweetDown.bind(this, index)}
          moveTweetUp={this.moveTweetUp.bind(this, index)}
        />
      )
    })

    return (
      <div>
      <ThreadContainer
        addTweet={this.onAddTweet}
        deleteTweet={this.onDeleteTweet.bind(this)}
        onPublishTweet={this.onPublishTweet.bind(this)}
        publishThread={this.onPublishThread.bind(this)}
        handleTweetEdit={this.handleTweetEdit.bind(this)}
        characterLimit={this.state.characterLimit}
        moveTweetDown={this.moveTweetDown.bind(this)}
        moveTweetUp={this.moveTweetUp.bind(this)}>
            {tweets}
      </ThreadContainer>
      </div>
      );
  }
}
