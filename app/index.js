import React from 'react';
import ReactDOM from 'react-dom';
import { Title, ParentComponent } from './components/App';
import '!style-loader!css-loader!tachyons/css/tachyons.css';

ReactDOM.render(
  <div className="mw5 center">
    <Title />
    <ParentComponent />
  </div>,
  document.getElementById('app')
);
