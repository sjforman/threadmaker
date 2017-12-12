import React, { Component } from 'react';
import logo from './logo.svg';
import css from './index.css';
import { TweetStormParent } from './TweetStorm';

class App extends Component {
  render() {
    return (
      <div className="">
        <header className="tc">
          <img src={logo} className="w3 mt3" alt="logo" />
          <h1 className="tc">Tweetstormer</h1>
        </header>
        <TweetStormParent />
      </div>
    );
  }
}

export default App;
