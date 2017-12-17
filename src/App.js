import React, { Component } from 'react';
import logo from './logo.svg';
import { Thread } from './Thread';

class App extends Component {
  render() {
    return (
      <div className="">
        <header className="tc">
          <img src={logo} className="w3 mt3" alt="logo" />
          <h1 className="tc">Tweetstormer</h1>
        </header>
        <Thread
          url='http://localhost:3001/api/tweets'
          pollInterval={2000}
        />
      </div>
    );
  }
}

export default App;
