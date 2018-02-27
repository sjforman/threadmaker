import React, { Component } from 'react';
import { Login } from './Login';
import logo from './logo.svg';

export class Home extends Component {
  render() {
    return (
      <div className="">


        <div className="tc pt5 pb3">
          <img src={logo} alt="logo" className="dib w3 v-mid pr1" />
          <h1 className="dib f3 f2-m f1-l fw2 black-90 mv3 v-mid">Threadbuilder</h1>
          <h2 className="f5 f4-m f3-l fw2 black-50 mt0 lh-copy">
            The easiest way to compose, edit, and publish Twitter threads.
          </h2>
      </div>

      <div className="mr-auto ml-auto w-60-ns w-100 pa2">
      <p className="f5 f4-ns lh-copy">
        With Threadbuilder, you can draft, save, edit, and reorder the tweets in a thread until you’re satisfied. Then click ‘publish’ to send ’em all to Twitter, properly threaded and with automatic numbering.
      </p>
        </div>

        <div className="pa5 tc">
          <Login history={this.props.history} />
        </div>

      </div>
    )
  }
}
