import React, { Component } from 'react';
import { Header } from './Header';
import { ThreadList } from './ThreadList'

export class Dashboard extends Component {
  constructor(props) {
    super(props)

    let jwtToken = this.props.jwtToken;
    let userId = this.props.userId;
    let screenName = this.props.screenName;

    if (this.props.history.location.jwtToken) {
      jwtToken = this.props.history.location.jwtToken;
      userId = this.props.history.location.userId;
      screenName = this.props.history.location.screenName;
    }

    this.state = {
      jwtToken: jwtToken,
      userId: userId,
      screenName: screenName
    };

  }

  render() {
    return (
      <div>
        <Header 
          history={this.props.history}
          screenName={this.state.screenName}/>
        <ThreadList
          url={process.env.REACT_APP_API_URL + '/threads'}
          jwtToken={this.state.jwtToken}
          isAuthenticated={this.props.isAuthenticated}
          screenName={this.props.screenName}
          userId={this.state.userId}
          pollInterval={process.env.REACT_APP_POLL_INTERVAL}/>
      </div>
    )
  }
}
