import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import { ThreadList } from './ThreadList';
import { Thread } from './Thread';

class ThreadParent extends Component {
  render() {
    return <Thread url='http://localhost:3001/api/threads' pollInterval={2000} routeParams={this.props.routeparams}/>
  }
}

class ThreadListParent extends Component {
  render() {
    return <ThreadList url='http://localhost:3001/api/threads' pollInterval={2000}/>
  }
}

class App extends Component {
  render() {

    return (
    <Router>
        <div>
        <header className="tc">
          <img src={logo} className="w3 mt3" alt="logo" />
          <h1 className="tc">Tweetstormer</h1>
        </header>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/threads">Threads</Link></li>
        </ul>

      <Route path="/threads" component={ThreadListParent}/>
      <Route path="/thread/:thread_id" component={ThreadParent}/>
      </div>
    </Router>
    );
  }
}

export default App;
