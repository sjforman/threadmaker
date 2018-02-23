import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Login } from './Login';
import logo from './logo.svg';

const LoginWithRouter = withRouter(Login);

export class Home extends Component {
  render() {
    return (
      <div className="">

        <div className="tc pa5">
          <img src={logo} className="dib w3 v-mid" alt="logo" />
          <h1 className="dib f3 f2-m f1-l fw2 black-90 mv3 v-mid">Threadbuilder</h1>
          <h2 className="f5 f4-m f3-l fw2 black-50 mt0 lh-copy">
      The easiest way to compose, edit, and publish Twitter threads.
          </h2>
      </div>

      <div className="mr-auto ml-auto w-40-ns w-100 pa2">
      <p className="f5 f4-ns lh-copy measure">
        Good threads require editing. With Threadbuilder you can draft, save, reorder and edit them until you’re satisfied, then click ‘publish‘ to send ’em all to Twitter, with automatic numbering.
      </p>
        </div>

        <div className="pa5 tc">
          <LoginWithRouter />
        </div>

      </div>
    )
  }
}
