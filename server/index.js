require('dotenv').config({ silent: true });
const winston = require('winston');
const fixtures = require('./fixtures');
const app = require('./app');

const production = process.env.NODE_ENV === 'production';
const port = production ? process.env.PORT : 3001;
const host = production ? process.env.HOST : 'localhost';

fixtures();

app.listen(port, host, () => {
  winston.log('info', `Server running at http://${host}:${port}`);
});
