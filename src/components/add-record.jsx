import React, { Component } from 'react';
import request from 'superagent';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import IconAdd from './icon-add';
import IconSearch from './icon-search';

class AddRecord extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      artist: '',
      albums: []
    };

    this.changeTitle = this.changeTitle.bind(this);
    this.changeArtist = this.changeArtist.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.searchRecords = this.searchRecords.bind(this);
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

  addRecord(title) {
    const record = {
      title,
      artist: this.state.artist
    };

    request.post('/api/records')
    .send(record)
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

  searchRecords(event) {
    event.preventDefault();
    const { artist } = this.state;

    const param = encodeURIComponent(artist);

    request.get(`/api/artist/${param}`)
    .end((err, res) => {
      if (res && res.text) {
        const response = JSON.parse(res.text).topalbums.album;

        const albums = _.map(response, album => (
          {
            artist: album.artist.name,
            name: album.name,
            image: album.image[(album.image.length - 1)]['#text']
          }
        ));

        const filteredAlbums =
        _.chain(albums)
         .filter(album => album.artist === artist && album.image !== '')
         .uniq(album => album.name)
         .value();

        this.setState({
          albums: filteredAlbums
        });
      }
    });
  }

  render() {
    const { albums, artist } = this.state;

    return (
      <section className="add-record">
        <h1>Add Record</h1>
        <form onSubmit={this.searchRecords}>
          <input onChange={this.changeArtist} type="text" value={artist} placeholder="artist" />
          <IconSearch color="#FFF" onClick={this.searchRecords} />
        </form>
        <section>
          {
            albums.length > 0
            ? albums.map((album, i) => (
              <figure className="record" key={i} onClick={() => this.addRecord(album.name)}>
                <img src={album.image} alt={album.name} />
                <figcaption>
                  <p>{album.artist}</p>
                  <p>{album.name}</p>
                </figcaption>
                <IconAdd color="#FFF" />
              </figure>
            ))
            : null
          }
        </section>
      </section>
    );
  }
}

export default AddRecord;
