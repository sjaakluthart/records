require('dotenv').config({ silent: true });
const express = require('express');
const path = require('path');
const winston = require('winston');
const Record = require('./record');
const records = require('../records.json');

const production = process.env.NODE_ENV === 'production';
const port = production ? process.env.PORT : 3001;
const host = production ? process.env.HOST : 'localhost';

Record.find({}, (err, docs) => {
  if (docs.length === 0) {
    winston.log('info', 'No records found, inserting from records.json');

    records.forEach((record) => {
      Record.create(record);
    });
  }
});

const app = express();

app.get('/api/records/all', (req, res) => {
  Record.find({}, (err, docs) => {
    if (err) {
      res.status(500).send(err);
    }

    res.send(docs);
  });
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
