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
    <div>
      <a className="link black bg-animate hover-blue" href={URL}>
        <svg className="w1" viewBox="0 0 32 32">
          <path d="M4 4 L12 4 L12 8 L8 8 L8 24 L24 24 L24 20 L28 20 L28 28 L4 28 z M16 4 L28 4 L28 16 L24 12 L16 20 L12 16 L20 8z"></path>
        </svg>
      </a>
    </div>
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
            <div className="fl w-10">
              <p className="f3 mv1 tc">{this.props.prefix}</p>
              <p>&nbsp;</p>
            </div>
            <textarea
              className="fl w-80 f3 db hover-black ba1 b--light-gray br2 mb2 h4 overflow-auto"
              value={this.props.text}
              onChange={this.props.handleTweetEdit}
            />
            <div className="fl w-10 pl2 mt5">
              <p className="f3 tc">{this.props.postfix}</p>
              <p>&nbsp;</p>
            </div>
        </div>

          <div className="fl w-100 w-10-ns pa2">
            <div>
              <button className="f6 dim br1 ba bw1 ph3 pv2 mb2 dib mid-gray" onClick={this.props.deleteTweet.bind(this)}>
                <svg className="w1" viewBox="0 0 32 32">
                  <path fill="#1da3b4" d="M4 4 L10 4 L12 2 L20 2 L22 4 L28 4 L29 8 L3 8 z M5 10 L27 10 L26 30 L6 30 z"></path>
                </svg>
              </button>
            </div>
            <CharacterCounter text={this.props.text} characterLimit={this.props.characterLimit} />
          </div>
        </div>
        ) :
          (
        <div className="mw9 center ph3-ns ba1 b--light-gray">
          <div className="ph2-ns">
            <div className="fl w-90">
              <p className="f3 pa2">{this.props.text}</p>
            </div>
            <div className="fl w-10 pa2 mt4">
              <TweetLink screenName={this.props.screenName} publishedTweetId={this.props.publishedTweetId} />
            </div>
          </div>
        </div>
        )}
          </div>
         </div>
      );
  }
}
