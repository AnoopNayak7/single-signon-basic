const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let token = null;

// Route for client app login (requests token from SSO provider)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const response = await axios.post('http://localhost:4000/login', { username, password });
    token = response.data.token;
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(401).json({ message: 'Login failed' });
  }
});

// Route to verify token with the SSO provider
app.get('/verify', async (req, res) => {
  if (!token) {
    return res.status(403).json({ message: 'No token available, please log in first' });
  }

  try {
    const response = await axios.get('http://localhost:4000/verify-token', {
      headers: { Authorization: token },
    });
    res.json({ message: 'Token verified', user: response.data.user });
  } catch (error) {
    res.status(403).json({ message: 'Token verification failed' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Client app running at http://localhost:${port}`);
});
