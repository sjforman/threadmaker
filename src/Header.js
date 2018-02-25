import React, { Component } from 'react';
import { Login } from './Login';
import logo from './logo.svg';

export class Header extends Component {
  render() {
    return (
      <div className="bb overflow-auto flex mb3">
        <div className="fl w-75 pa2 v-mid">
          <img src={logo} className="dib w3 v-mid" alt="logo" />
          <a href="/dashboard" className="link black bg-animate hover-blue">
            <h1 className="lh-title dib v-mid">Threadbuilder</h1>
          </a>
        </div>
        <div className="fl w-25 mt3 pa2">
          <Login history={this.props.history}/>
        </div>
      </div>
    );
  }
}
