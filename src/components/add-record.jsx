import React, { Component } from 'react';
import request from 'superagent';
import { browserHistory } from 'react-router';

class AddRecord extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      artist: ''
    };

    this.changeTitle = this.changeTitle.bind(this);
    this.changeArtist = this.changeArtist.bind(this);
    this.addRecord = this.addRecord.bind(this);
  }

  componentDidMount() {
    request.get('/api/authenticated')
    .end((err, res) => {
      if (res && res.status === 400) {
        browserHistory.replace('/login');

        return false;
      }

      return false;
    });
  }

  changeTitle(event) {
    this.setState({
      title: event.currentTarget.value
    });
  }

  changeArtist(event) {
    this.setState({
      artist: event.currentTarget.value
    });
  }

  addRecord(event) {
    event.preventDefault();

    request.post('/api/records')
    .send(this.state)
    .end((err, res) => {
      if (res && res.status === 400) {
        browserHistory.replace('/login');

        return false;
      }

      if (res && res.status === 201) {
        browserHistory.push('/');

        return false;
      }

      return false;
    });
  }

  render() {
    const { title, artist } = this.state;

    return (
      <section>
        <h1>Add Record</h1>
        <form onSubmit={this.addRecord}>
          <input onChange={this.changeTitle} type="text" value={title} placeholder="title" />
          <input onChange={this.changeArtist} type="text" value={artist} placeholder="artist" />
          <input type="submit" value="Add Record" />
        </form>
      </section>
    );
  }
}

export default AddRecord;
