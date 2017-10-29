import React from 'react';
import { TweetArea } from './TweetArea';

class TweetStorm extends React.Component {
  render() {
    return (
    <div>
      <div id="buttons">
        <a className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.addTweet}>
          Add Tweet
        </a>
        <a className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" href="#" onClick={this.props.deleteTweet}>
          Delete Tweet
        </a>
      </div>
      <div id="tweetstorm-div">
        {this.props.children}
      </div>
    </div>
    );
  }
}

export class TweetStormParent extends React.Component {
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
  }

  onDeleteTweet() {
    if (this.state.numTweets > 1) {
      console.log(this.state.numTweets);
      this.setState({
        numTweets : this.state.numTweets - 1
      });
    }
  }

  render() {
    const tweets = [];

    for (var i = 0; i < this.state.numTweets; i+=1) {
      tweets.push(<TweetArea key={i} number={i} />);
    };

    return (
      <div>
      <TweetStorm addTweet={this.onAddTweet} deleteTweet={this.onDeleteTweet}>
        {tweets}
      </TweetStorm >
      </div>
      );
  }

}

