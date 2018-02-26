import React, { Component } from 'react';
import { Header } from './Header';
import { ThreadList } from './ThreadList'

export class Dashboard extends Component {
  render() {
    return (
      <div>
        <Header history={this.props.history}/>
        <ThreadList
          url={process.env.REACT_APP_API_URL + '/threads'}
          jwtToken={localStorage.getItem('jwtToken')}
          isAuthenticated={this.props.isAuthenticated}
          screenName={this.props.screenName}
          pollInterval={process.env.REACT_APP_POLL_INTERVAL}/>
      </div>
    )
  }
}
