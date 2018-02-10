import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import { ThreadList } from './ThreadList';
import { Thread } from './Thread';
import { Home } from './Home';

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

  /* TODO: there should be a way to expose the properties and state of the app
   * to the components that get rendered, to obviate need for the parent
   * components. */

  /* TODO: extract the header stuff into a generic "page" component */

class App extends Component {
  render() {

    return (
    <Router>
        <div>
        <header className="tc">
          <img src={logo} className="w3 mt3" alt="logo" />
          <h1 className="tc">Threadbuilder</h1>
        </header>

      <Route exact path="/" component={Home}/>
      <Route exact path="/threads" component={ThreadListParent}/>
      <Route path="/thread/:thread_id" component={ThreadParent}/>
      </div>
    </Router>
    );
  }
}

export default App;
