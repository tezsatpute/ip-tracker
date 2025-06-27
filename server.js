const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Route to track visitor IP and location
app.get('/visit', async (req, res) => {
  // Get the real IP, considering proxy headers (used by Render)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('Visitor IP: ${ip}');

  try {
    // Fetch geolocation data from ipapi.co
    const response = await axios.get('https://ipapi.co/${ip}/json/');
    const geo = response.data;

    // Log geolocation data
    console.log("Geo Data:", geo);

    // Respond with IP and location info
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
    res.send('<p>Your IP is ${ip}, but geolocation lookup failed.</p>');
  }
});

// Root route for quick status check
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the IP Tracker App</h1><p>Visit <a href="/visit">/visit</a> to track your IP.</p>');
});

// Start the server
app.listen(port, () => {
  console.log('Server running on port ${port}');
});