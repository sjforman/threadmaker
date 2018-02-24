import React, { Component } from 'react';
import { Header } from './Header';
import { ThreadList } from './ThreadList';

export class Dashboard extends Component {
  render() {
    return (
      <div>
        <Header history={this.props.history}/>
        <ThreadList
          url='http://localhost:3001/api/threads'
          jwtToken={localStorage.getItem('jwtToken')}
          isAuthenticated={this.props.isAuthenticated}
          screenName={this.props.screenName}
          pollInterval={2000}/>
      </div>
    )
  }
}
