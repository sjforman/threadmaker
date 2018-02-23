import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Thread } from './Thread';
import { Home } from './Home';
import { Dashboard } from './Dashboard';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, screenName: null};
  }

  loadUserFromToken() {
    let token = localStorage.getItem('jwtToken');
    if(!token || token === '') {
      return;
    }
    else {
      let screenName = localStorage.getItem('screenName');
      this.setState({isAuthenticated: true, screenName: screenName });
    }
  }

  componentWillMount() {
    this.loadUserFromToken()
  }

  render() {
    return (
    <Router>
      <div>
        <Route exact path="/" component={Home}/>
        <Route exact path="/dashboard" render={()=>(
          !this.state.isAuthenticated ? (
            <Redirect to="/"/>
          ) : (
          <Dashboard/>
          )
        )}/>
        <Route path="/thread/:thread_id" render={({match})=>
          !this.state.isAuthenticated ? (
            <Redirect to="/"/>
          ) : (
          <Thread
            match={match}
            pollInterval={2000}
            thread_id={match.params.thread_id}
            url='http://localhost:3001/api/threads'
          />
          )
        }/>
      </div>
    </Router>
    );
  }
}

export default App;
