const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Helper to extract real client IP
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  return req.connection.remoteAddress || req.socket.remoteAddress;
}

// Main route
app.get('/visit', async (req, res) => {
  const ip = getClientIp(req);
  console.log(`Visitor IP: ${ip}`);

  try {
    const response = await axios.get(`https://ipwho.is/${ip}`);
    const geo = response.data;

    if (!geo.success) {
      console.error('Geolocation API failed:', geo.message);
      return res.send(`<p>Could not retrieve location for IP: ${ip}</p>`);
    }

    console.log('Geo Data:', geo);

    res.send(`
      <h1>IP Tracker</h1>
      <p><strong>IP:</strong> ${geo.ip}</p>
      <p><strong>City:</strong> ${geo.city}</p>
      <p><strong>Region:</strong> ${geo.region}</p>
      <p><strong>Country:</strong> ${geo.country}</p>
      <p><strong>ISP:</strong> ${geo.connection?.isp || 'N/A'}</p>
    `);
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
    res.send(`
      <p>Your IP is ${ip}, but the geolocation request failed.</p>
    `);
  }
});

// Default route
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to IP Tracker</h1><p>Go to <a href="/visit">/visit</a> to get IP and location.</p>`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});