import React from 'react';

class CharacterCounter extends React.Component {
  render() {

    let over = false;
    if (this.props.text.length > this.props.characterLimit) {
      over = true;
    }

    return(
      <p className={over ? "red" : ""}>{this.props.text.length} / {this.props.characterLimit}</p>
    )
  }
}

export class Tweet extends React.Component {
  render() {
    return (

      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">

      <div className="fl w-100 w-10-ns pa2">
        <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetUp.bind(this)}>move up</button>
        <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetDown.bind(this)}>move down</button>
      </div>
      <div className="fl w-100 w-80-ns pa2">
        <div>
          <textarea
            className="w-100 f3 db hover-black ba1 b--light-gray pa2 br2 mb2 h4 overflow-auto"
            value={this.props.text}
            onChange={this.props.handleTweetEdit}
          />
          <p>{this.props.pubstatus}</p>
        </div>
      </div>

        <div className="fl w-100 w-10-ns pa2">
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>
            Delete tweet
          </button>
          <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.publishTweet.bind(this)}>
            Publish tweet
          </button>
          <CharacterCounter text={this.props.text} characterLimit={this.props.characterLimit} />
        </div>
      </div>
      </div>
      );
  }
}
