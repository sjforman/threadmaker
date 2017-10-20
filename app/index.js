import React from 'react';
import ReactDOM from 'react-dom';
import { Title, ParentComponent } from './components/App';

ReactDOM.render(
  <div>
    <Title />
    <ParentComponent />
  </div>,
  document.getElementById('app')
);
