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
        <label>
        Character limit:
        <select defaultValue={this.props.characterLimit} onChange={this.props.handleCharacterLimitChange}>
          <option value="140">140</option>
          <option value="280">280</option>
        </select>
      </label>
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
      characterLimit: '140',
      tweets: [],
      jwtToken: localStorage.getItem('jwtToken'),
      threadId: this.props.thread_id
    };

    /* TODO: persist character limit as a property of the thread */
    /* TODO: wouldn't a more descriptive name for "handle change" better? */

    this.handleCharacterLimitChange = this.handleCharacterLimitChange.bind(this);
    this.loadTweetsFromServer = this.loadTweetsFromServer.bind(this);
    this.onAddTweet = this.onAddTweet.bind(this);
    this.onDeleteTweet = this.onDeleteTweet.bind(this);
    this.onPublishTweet = this.onPublishTweet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.moveTweetDown = this.moveTweetDown.bind(this);
    this.moveTweetUp = this.moveTweetUp.bind(this);
  }

  handleCharacterLimitChange(event){
    this.setState({characterLimit: event.target.value})
  }

  /* TODO: Don't include headers if jwtToken not set? */

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

  /* TODO: Bug: currently, if you delete all the text from a tweet, you can't save it
   * empty. */
  handleTweetSubmit(index, e) {
    var newtweet = this.state.tweets[index];
    var tweetid = this.state.tweets[index]._id;
    axios.put(
        `${this.props.url}/${this.state.threadId}/${tweetid}`,
        newtweet,
        { 'x-auth-token': this.state.jwtToken }
    )
       .catch(err => {
        console.error(err);
      });
  }

  onAddTweet() {
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
        text: ''
      }
      array.push(tweet)
      this.setState({tweets: array})
      console.log('Tweet added: ' + JSON.stringify(tweet));
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
    console.log('Deleting tweet: ' + JSON.stringify(array[index]));
    array.splice(index, 1);
    this.setState({tweets: array})
    /* TODO: would it be better to `put` the thread instead of
     * deleting the specific tweet? */
    axios.delete(
      `${this.props.url}/${threadid}/${tweetid}`,
      { 'x-auth-token': this.state.jwtToken }
    )
      .then(res => {
        console.log('Tweet deleted: ' + JSON.stringify(tweetid));
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleChange(index, e) {
    var newTweet = {
      _id: this.state.tweets[index]._id,
      text: e.target.value }
    var array = this.state.tweets
    array.splice(index, 1, newTweet)
    this.setState({tweets: array});
  }

  /* Seems like I should be able to parameterize this into a `moveTweet`
   * function that takes an argument for direction. Tried, but couldn't
   * figure out how to do that.*/

  moveTweetUp(index, e) {
    /* TODO: componentize the "up" and "down" buttons
     * and have their state depend on their position
     * so as to disable them rather than allow them to be clicked
     * when they shouldn't be */
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

  onPublishTweet(index, e) {
    let tweet = this.state.tweets[index];
    let jwtToken = this.state.jwtToken;
    let oauthToken = localStorage.getItem('oauthToken');
    let oauthSecret = localStorage.getItem('oauthSecret');
    axios({
        method: 'POST',
        url: 'http://localhost:3001/api/publish',
        data:  tweet,
        headers: { 'x-auth-token': jwtToken, 
          'oauthToken' : oauthToken,
          'oauthSecret' : oauthSecret,
        }
    })
    .catch(err => {
      console.error(err);
    });
    console.log('Index of Tweet to publish: ' + index);
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
          deleteTweet={this.onDeleteTweet.bind(this, index)}
          publishTweet={this.onPublishTweet.bind(this, index)}
          handleChange={this.handleChange.bind(this, index)}
          handleTweetSubmit={this.handleTweetSubmit.bind(this, index)}
          characterLimit={this.state.characterLimit}
          moveTweetDown={this.moveTweetDown.bind(this, index)}
          moveTweetUp={this.moveTweetUp.bind(this, index)}
          text={tweet.text}/>
      )
    })

    return (
      <div>
      <ThreadContainer
        addTweet={this.onAddTweet}
        deleteTweet={this.onDeleteTweet.bind(this)}
        publishTweet={this.onPublishTweet.bind(this)}
        handleChange={this.handleChange.bind(this)}
        handleCharacterLimitChange={this.handleCharacterLimitChange.bind(this)}
        characterLimit={this.state.characterLimit}
        moveTweetDown={this.moveTweetDown.bind(this)}
        moveTweetUp={this.moveTweetUp.bind(this)}>
          {tweets}
      </ThreadContainer>
      </div>
      );
  }
}
