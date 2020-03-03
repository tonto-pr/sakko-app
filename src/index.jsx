import React from 'react';
import ReactDOM from 'react-dom';
import Title from './components/Title';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <Title />,
  document.getElementById('app')
);

module.hot.accept();