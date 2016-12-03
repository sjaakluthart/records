require('dotenv').config({ silent: true });
const mongoose = require('mongoose');
const winston = require('winston');

const url = process.env.MONGO_URL;

mongoose.connect(url, () => {
  winston.log('info', 'Connected to DB.');
});

module.exports = mongoose;
