import React from 'react';
import { Tweet } from './TweetArea';

class TweetStorm extends React.Component {
  render() {
    return (
    <div>
      <div id="buttons" className="tc mb4">
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.addTweet}>
        +
        </button>
        <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" href="#" onClick={this.props.deleteTweet}>
        -
        </button>
      </div>
      <div id="tweetstorm-div">
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
        numTweets : 1
    };
    this.onAddTweet = this.onAddTweet.bind(this);
    this.onDeleteTweet = this.onDeleteTweet.bind(this);
  }

  onAddTweet() { 
    this.setState({
      numTweets : this.state.numTweets + 1
    });
    console.log(this.state);
  }

  onDeleteTweet() {
    if (this.state.numTweets > 1) {
      this.setState({
        numTweets : this.state.numTweets - 1
      });
    }
  }

  render() {
    const tweets = [];

    for (var i = 0; i < this.state.numTweets; i+=1) {
      tweets.push(<Tweet key= {i} number={i+1} deleteTweet={this.onDeleteTweet} />);
    };

    return (
      <div>
      <TweetStorm addTweet={this.onAddTweet} deleteTweet={this.onDeleteTweet} numTweets={tweets.length}>
        {tweets}
      </TweetStorm >
      </div>
      );
  }

}
