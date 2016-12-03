const express = require('express');
const path = require('path');

const app = express();

app.set('port', (process.env.PORT || 3001));

app.get('/api/test', (req, res) => {
  res.send('Hi from API');
});

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(app.get('port'), () => {
  console.log(`Server running at ${app.get('port')}`); // eslint-disable-line no-console
});
