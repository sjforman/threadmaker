import React from 'react';
import axios from 'axios';
import { Tweet } from './Tweet';

class ThreadContainer extends React.Component {
  render() {
    return (
    <div>
      <div id="buttons" className="tc mb4">
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.addTweet}>
        +
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
      tweets: []
    };
    this.loadTweetsFromServer = this.loadTweetsFromServer.bind(this);
    this.onAddTweet = this.onAddTweet.bind(this);
    this.onDeleteTweet = this.onDeleteTweet.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  loadTweetsFromServer() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ tweets: res.data })
      })
  }

  onAddTweet() { 
    var array = this.state.tweets
    var tweet = {
      text: ''
    }
    array.push(tweet)
    this.setState({tweets: array})
  }

  onDeleteTweet(index, e) {
    var array = this.state.tweets
    array.splice(index, 1);
    this.setState({tweets: array})
  }

  handleChange(index, e) {
    var newTweet = { text: e.target.value }
    var array = this.state.tweets
    array.splice(index, 1, newTweet)
    this.setState({tweets: array});
  }
  
  componentDidMount() {
    this.loadTweetsFromServer();
  }

  render() {

    var tweets = this.state.tweets.map((tweet, index) => {
      return (
        <Tweet key={index} index={index} deleteTweet={this.onDeleteTweet.bind(this, index)} handleChange={this.handleChange.bind(this, index)} text={tweet.text}/>
      )
    })

    return (
      <div>
      <ThreadContainer addTweet={this.onAddTweet} deleteTweet={this.onDeleteTweet.bind(this)} handleChange={this.handleChange.bind(this)}>
        {tweets}
      </ThreadContainer>
      </div>
      );
  }
}
