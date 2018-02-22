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

class TweetLink extends React.Component {
  render() {
    let baseURL = 'https://twitter.com/';
    let userHandle = this.props.screenName;
    let URL = baseURL + userHandle + '/status/' + this.props.publishedTweetId;
  return(
    <a href={URL}>{URL}</a>
  )}
}

export class Tweet extends React.Component {
  render() {

    return (

      <div className="mw9 center ph3-ns mb3 bb">
        <div className="cf ph2-ns">

        {!this.props.pubStatus ?

         (
        <div>
        <div className="fl w-100 w-10-ns pa2">
          <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetUp.bind(this)}>move up</button>
          <button className="f6 link dim br1 ba bw1 ph2 pv2 mb2 dib mid-gray" onClick={this.props.moveTweetDown.bind(this)}>move down</button>
        </div>
        <div className="fl w-100 w-80-ns pa2">
            <span className="fl w-10 f3">{this.props.prefix}</span>
            <textarea
              className="fl w-80 f3 db hover-black ba1 b--light-gray br2 mb2 h4 overflow-auto"
              value={this.props.text}
              onChange={this.props.handleTweetEdit}
            />
            <span className="fl w-10 f3">{this.props.postfix}</span>
        </div>

          <div className="fl w-100 w-10-ns pa2">
            <div>
              <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>
                Delete tweet
              </button>
            </div>
            <button className="f6 link dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.onPublishTweet.bind(this)}>
              Publish tweet
            </button>
            <CharacterCounter text={this.props.text} characterLimit={this.props.characterLimit} />
          </div>
        </div>
        ) :
          (
          <div className="fl w-100 pa2">
            <p className="w-100 f3 db hover-black ba1 b--light-gray pa2 br2 mb2 pre">{this.props.text}</p>
            <TweetLink screenName={this.props.screenName} publishedTweetId={this.props.publishedTweetId} />
          </div>
        )}
          </div>
         </div>
      );
  }
}
