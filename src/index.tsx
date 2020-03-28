import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TitlePage from './components/TitlePage.tsx';

import "./css/styles.scss"

ReactDOM.render(
  <TitlePage message="sakko.app is coming"
   message2="stay tuned" />,
  document.getElementById('app')
);

module.hot.accept();