const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const path = require('path');
const settings = require('../settings.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const request = require('superagent');
const winston = require('winston');
const Record = require('./record');
const User = require('./user');

const app = express();

app.use(session({
  genid() {
    return uuid.v1();
  },
  resave: false,
  saveUninitialized: true,
  secret: settings.secret
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    bcrypt.compare(password, user.password, (compareErr, success) => {
      if (!success) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return null;
    });
    return done(null, user);
  });
}));

app.get('/api/records/all', (req, res) => {
  Record.find({}, (err, docs) => {
    if (err) {
      res.status(500).send(err);
    }

    res.send(docs);
  });
});

app.get('/api/artist/:name', (req, res) => {
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${req.params.name}&api_key=${settings.lastFmKey}&autocorrect[1]&format=json`;

  request.get(url).end((err, result) => {
    res.send(result.body);
  });
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  winston.log('info', `Succesfully authenticated user ${req.body.username}`);

  res.send('authenticated');
});

app.get('/api/authenticated', (req, res) => {
  const authenticated = Boolean(req.session.passport);

  if (!authenticated) {
    return res.status(400).send('Bad request');
  }

  return res.send('authenticated');
});

app.post('/api/records', (req, res) => {
  const authenticated = Boolean(req.session.passport);

  if (!authenticated) {
    return res.status(400).send('Bad request');
  }

  const url = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=
  ${settings.lastFmKey}&artist=${req.body.artist}&album=${req.body.title}&format=json`;

  request.get(url)
  .end((err, result) => {
    if (result && result.body && result.body.album && result.body.album.image) {
      const record = {
        title: req.body.title,
        artist: req.body.artist,
        cover: result.body.album.image[3]['#text']
      };

      Record.create(record);

      return res.status(201).send(`Added ${req.body.title} from ${req.body.artist}`);
    }

    return res.status(400).send('Bad request');
  });

  return false;
});

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
