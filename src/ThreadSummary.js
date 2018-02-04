import React from 'react';

export class ThreadSummary extends React.Component {
  render() {

    const threadlink = '/thread/' + this.props.id;

    return (
      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">
          <div className="fl w-100 pa2">
            <a className="link" href={threadlink}>{this.props.id}</a>
            <p>{this.props.numTweets} tweets</p>
            <p>1/ {this.props.firstTweet}</p>
            <p>...</p>
            <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 mr1 dib mid-gray" href="#" onClick={this.props.deleteThread.bind(this)}>
            delete
            </button>
          </div>
        </div>
      </div>
      );
  }
}
