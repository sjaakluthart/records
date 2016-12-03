const db = require('./db.js');

const Record = db.model('Record', {
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: String, required: true },
  cover: { type: String, required: true }
});

module.exports = Record;
