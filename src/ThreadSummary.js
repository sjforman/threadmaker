import React from 'react';

export class ThreadSummary extends React.Component {
  render() {

    const threadlink = '/thread/' + this.props.id;
    var firstTweet = '...';

    if (this.props.tweets.length > 0 && this.props.tweets[0].text) {
      firstTweet = this.props.tweets[0].text.slice(0,80) + '...';
    }

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
            <div className="fl w-10 pa2 tc">
                <p>{this.props.numTweets}</p>
            </div>
          <a className="link black bg-animate hover-blue" href={threadlink}>
            <div className="fl w-80 mv2 ba b--near-white">
              <p>{firstTweet}</p>
            </div>
          </a>
          <div className="fl w-10 pl2 pt2 tc">
            <button className="f6 link dim br1 ba ph3 pv2 mv1 mr1 dib mid-gray" href="#" onClick={this.props.deleteThread.bind(this)}>
              <svg className="w1" viewBox="0 0 32 32">
                <path fill="#1da3b4" d="M4 4 L10 4 L12 2 L20 2 L22 4 L28 4 L29 8 L3 8 z M5 10 L27 10 L26 30 L6 30 z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      );
  }
}
