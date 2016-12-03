import React, { Component } from 'react';
import request from 'superagent';

class Home extends Component {
  componentDidMount() {
    request.get('/api/test').end((err, res) => {
      if (err) {
        console.log(err);
      }

      console.log(res);
    });
  }

  render() {
    return (
      <main>
        <h1>Records</h1>
      </main>
    );
  }
}


export default Home;
