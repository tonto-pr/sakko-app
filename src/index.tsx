import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Title from './components/Title.tsx';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <Title message="Leivalle ;)" />,
  document.getElementById('app')
);

module.hot.accept();