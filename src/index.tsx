import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Title from './components/Title.tsx';

ReactDOM.render(
  <Title message="Sakko.app" />,
  document.getElementById('app')
);

module.hot.accept();