import React, { Component } from 'react';
import request from 'superagent';
import RecordList from './record-list';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      records: []
    };
  }

  componentDidMount() {
    request.get('/api/records/all').end((err, res) => {
      if (err) {
        console.log(err);
      }

      if (res.status === 200 && res.text) {
        const records = JSON.parse(res.text);

        this.setState({
          records
        });
      }
    });
  }

  render() {
    const { records } = this.state;

    return (
      <section className="home">
        <h1>Records</h1>
        {records.length > 0 ? <RecordList records={records} /> : <p>Loading...</p>}
      </section>
    );
  }
}


export default Home;
