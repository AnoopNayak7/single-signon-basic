const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const secretKey = 'my_sso_secret_key';

// Mock user database
const users = [
  { id: 1, username: 'admin', password: 'password123' },
];

// Login route - Issues a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
  
  res.json({ token });
});

// Verify token route (simulating an SSO check)
app.get('/verify-token', (req, res) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token missing' });
  }
  
  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ user: decoded });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`SSO Provider running at http://localhost:${port}`);
});
