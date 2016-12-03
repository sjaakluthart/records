import React, { Component } from 'react';
import request from 'superagent';
import RecordList from './record-list';

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
      <section className="home">
        <h1>Records</h1>
        <RecordList />
      </section>
    );
  }
}


export default Home;
