import React, { Component } from 'react';
import request from 'superagent';
import { browserHistory } from 'react-router';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: ''
    };

    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.login = this.login.bind(this);
  }

  changeUsername(event) {
    this.setState({
      username: event.currentTarget.value
    });
  }

  changePassword(event) {
    this.setState({
      password: event.currentTarget.value
    });
  }

  login(event) {
    event.preventDefault();

    request.post('/api/login/')
    .send(this.state)
    .end((err, res) => {
      if (res && res.status === 200) {
        browserHistory.push('/add-record');
      }
    });
  }

  render() {
    const { username, password } = this.state;

    return (
      <section className="login">
        <h1>Login</h1>
        <form onSubmit={this.login}>
          <input
            onChange={this.changeUsername}
            type="text"
            value={username}
            placeholder="username"
          />
          <input
            onChange={this.changePassword}
            type="password"
            value={password}
            placeholder="password"
          />
          <input type="submit" />
        </form>
      </section>
    );
  }
}

export default Login;
