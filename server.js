const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/visit', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  console.log('Visitor IP: ${ip}');

  try {
    const geo = await axios.get(https://ipapi.co/${ip}/json/);
    console.log('Location info:', geo.data);
  } catch (err) {
    console.error('Geolocation failed:', err.message);
  }

  res.send(`
    <h1>Thanks for visiting!</h1>
    <p>Your visit has been logged for testing purposes.</p>
  `);
});

app.get('/', (req, res) => {
  res.send(<h2>Welcome to the IP Tracker Demo</h2><a href="/visit">Click here to be logged</a>);
});

app.listen(port, () => {
  console.log(Server running on http://localhost:${port});
});