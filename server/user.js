const db = require('./db.js');

const User = db.model('User', {
  username: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = User;
