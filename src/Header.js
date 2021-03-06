import React, { Component } from 'react';
import { Logout } from './Login';
import logo from './logo.svg';

export class Header extends Component {
  render() {
    return (
      <div className="bb overflow-auto flex mb3">
        <div className="fl w-75 pa2 v-mid">
          <img src={logo} className="dib w2 v-mid ph3" alt="logo" />
          <a href="/dashboard" className="link black bg-animate hover-blue">
            <h1 className="lh-title dib v-mid">Threadmaker</h1>
          </a>
        </div>
        <div className="fl tr w-25 mt3 pt2 pr4">
          <Logout 
            history={this.props.history} 
            screenName={this.props.screenName}
            avatarUrl={this.props.avatarUrl}/>
        </div>
      </div>
    );
  }
}
