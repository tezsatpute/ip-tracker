const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
}

app.get('/visit', async (req, res) => {
  const ip = getClientIp(req);
  console.log(`'Resolved client IP: ${ip}`);

  const lookupIp = (!ip || ip === '::1' || ip === '127.0.0.1') ? '8.8.8.8' : ip;

  try {
    const response = await axios.get(`https://ipapi.co/${lookupIp}/json/`);
    const geo = response.data;

    console.log("Geo Data:", geo);

    res.send(`
      <h1>IP Tracker</h1>
      <p><strong>IP:</strong> ${ip}</p>
      <p><strong>City:</strong> ${geo.city}</p>
      <p><strong>Region:</strong> ${geo.region}</p>
      <p><strong>Country:</strong> ${geo.country_name}</p>
      <p><strong>ISP:</strong> ${geo.org}</p>
    `);
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
    res.send(`<p>Your IP is ${ip}, but geolocation lookup failed (404).</p>`);
  }
});

app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the IP Tracker</h1><p>Visit <a href="/visit">/visit</a> to check your IP and location.</p>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});