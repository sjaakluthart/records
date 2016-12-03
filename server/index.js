const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/test', (req, res) => {
  res.send('Hi from API');
});

app.listen(app.get('port'), () => {
  console.log(`Server running at ${app.get('port')}`); // eslint-disable-line no-console
});
