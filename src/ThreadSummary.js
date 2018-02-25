import React from 'react';

export class ThreadSummary extends React.Component {
  render() {

    const threadlink = '/thread/' + this.props.id;
    var tweetsPresent = false;
    var firstTweet = '...';

    if (this.props.tweets.length > 0) {
      tweetsPresent = true;
      firstTweet = this.props.tweets[0].text.slice(0,80) + '...';
    }

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
            <div className="fl w-20 pa2">
                <p>{this.props.numTweets} tweets</p>
            </div>
          <a className="link black bg-animate hover-blue" href={threadlink}>
            <div className="fl w-60 mv2 ba b--near-white">
              <p>{firstTweet}</p>
            </div>
          </a>
          <div className="fl w-20 pa2">
            <button className="f6 link dim br1 ba bw1 ph3 pv2 mv1 mr1 dib mid-gray" href="#" onClick={this.props.deleteThread.bind(this)}>
            delete thread
            </button>
          </div>
        </div>
      </div>
      );
  }
}
