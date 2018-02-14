import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Thread } from './Thread';
import { Home } from './Home';

class App extends Component {
  render() {

    return (
    <Router>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/thread/:thread_id" render={({match})=>
          <Thread
            match={match}
            pollInterval={2000}
            thread_id={match.params.thread_id}
            url='http://localhost:3001/api/threads'
          />
        }/>
      </div>
    </Router>
    );
  }
}

export default App;
