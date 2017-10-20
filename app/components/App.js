import React from 'react';
import { Button } from './Button';
import { TweetArea } from './TweetArea';


export class Title extends React.Component { 
  render() {
    return <h1>Tweetstormer</h1>;
  }
}

export class ParentComponent extends React.Component {
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
    this.setState({
      numTweets : this.state.numTweets - 1
    });
  }

  render() {
    const tweets = [];

    for (var i = 0; i < this.state.numTweets; i+=1) {
      tweets.push(<TweetArea key={i} number={i} />);
    };

    console.log(tweets);

    return (
      <div>
      <TweetStorm addTweet={this.onAddTweet} deleteTweet={this.onDeleteTweet}>
        {tweets}
      </TweetStorm >
      </div>
      );
  }

}

export class TweetStorm extends React.Component {
  render() {
    return (
    <div>
      <button onClick={this.props.addTweet}>
        Add Tweet
      </button>
      <button onClick={this.props.deleteTweet}>
        Delete Tweet
      </button>
      <div id="tweetstorm-div">
        {this.props.children}
      </div>
    </div>
    );
  }
}
