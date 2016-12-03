import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './components/app';
import Home from './components/home';
import Login from './components/login';
import './css/reset.css';
import './css/fonts.css';
import './css/index.css';
import './css/home.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
    </Route>
  </Router>,
  document.getElementById('root')
);
