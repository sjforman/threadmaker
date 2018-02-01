import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import { ThreadList } from './ThreadList';
import { Thread } from './Thread';

class ThreadParent extends Component {
  render() {
    return <Thread url='http://localhost:3001/api/threads' pollInterval={2000} thread_id={this.props.match.params.thread_id}/>
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
          <Link to="/">
            <h1 className="tc">Threadbuilder</h1>
          </Link>
        </header>

      <Route exact path="/" component={ThreadListParent}/>
      <Route path="/thread/:thread_id" component={ThreadParent}/>
      </div>
    </Router>
    );
  }
}

export default App;
