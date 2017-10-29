import React from 'react';
import ReactDOM from 'react-dom';
import { TweetStormParent } from './TweetStorm';
import '!style-loader!css-loader!tachyons/css/tachyons.css';

ReactDOM.render(
  <div className="mw5 center">
    <h1 className="f1 lh-solid">Tweetstormer</h1>
    <TweetStormParent />
  </div>,
  document.getElementById('app')
);
