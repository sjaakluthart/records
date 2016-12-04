const winston = require('winston');
const bcrypt = require('bcrypt');
const Record = require('./record');
const User = require('./user');
const settings = require('../settings.json');
const records = require('../records.json');

const saltRounds = 10;

function fixtures() {
  Record.find({}, (err, docs) => {
    if (docs.length === 0) {
      winston.log('info', 'No records found, inserting from records.json');

      records.forEach((record) => {
        Record.create(record);
      });
    }
  });

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
}

module.exports = fixtures;
