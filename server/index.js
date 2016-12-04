require('dotenv').config({ silent: true });
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const path = require('path');
const winston = require('winston');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const request = require('superagent');
const Record = require('./record');
const User = require('./user');
const settings = require('../settings.json');
const records = require('../records.json');

const production = process.env.NODE_ENV === 'production';
const port = production ? process.env.PORT : 3001;
const host = production ? process.env.HOST : 'localhost';

const saltRounds = 10;

// Record.find({}, (err, docs) => {
//   if (docs.length === 0) {
//     winston.log('info', 'No records found, inserting from records.json');
//
//     records.forEach((record) => {
//       Record.create(record);
//     });
//   }
// });

User.find({}, (err, docs) => {
  if (docs.length === 0) {
    winston.log('info', 'No users found, inserting from settings.json');

    settings.users.forEach((user) => {
      bcrypt.hash(user.password, saltRounds, (hashErr, hash) => {
        User.create({
          username: user.username,
          password: hash
        });
      });
    });
  }
});

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
        cover: result.body.album.image[2]['#text']
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

app.listen(port, host, () => {
  winston.log('info', `Server running at http://${host}:${port}`);
});
