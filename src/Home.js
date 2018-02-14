import React, { Component } from 'react';
import { Header } from './Header';
import { ThreadList } from './ThreadList';

export class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <ThreadList url='http://localhost:3001/api/threads' jwtToken={localStorage.getItem('jwtToken')} pollInterval={2000}/>
      </div>
    )
  }
}
