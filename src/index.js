import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './components/app';
import Home from './components/home';
import Login from './components/login';
import AddRecord from './components/add-record';
import './css/reset.css';
import './css/fonts.css';
import './css/index.css';
import './css/home.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="add-record" component={AddRecord} />
    </Route>
  </Router>,
  document.getElementById('root')
);
