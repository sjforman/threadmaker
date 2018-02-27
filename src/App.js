import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Thread } from './Thread';
import { Home } from './Home';
import { Dashboard } from './Dashboard';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { isAuthenticated: false, screenName: null, jwtToken: null, userId: null};
  }

  componentWillMount() {
    let token = localStorage.getItem('jwtToken');
    if(!token || token === '') {
      return;
    }
    else {
      let screenName = localStorage.getItem('screenName');
      let userId = localStorage.getItem('userId');
      this.setState({isAuthenticated: true, screenName: screenName, jwtToken: token, userId: userId});
    }
  }

  render() {
    return (
    <Router>
      <div>
        <Route exact path="/" component={Home}/>
        <Route exact path="/dashboard" render={({history})=>(
            <Dashboard
              history={history}
              isAuthenticated={this.state.isAuthenticated}
              screenName={this.state.screenName}
              userId={this.state.userId}
              jwtToken={this.state.jwtToken}/>
        )}/>
        <Route path="/thread/:thread_id" render={({match, history})=>
          !this.state.isAuthenticated ? (
            <Redirect to="/"/>
            ) : (
            <Thread
              match={match}
              history={history}
              pollInterval={process.env.REACT_APP_POLL_INTERVAL}
              thread_id={match.params.thread_id}
              url={process.env.REACT_APP_API_URL + '/threads'}/>
        )}/>
      </div>
    </Router>
    );
  }
}

export default App;
