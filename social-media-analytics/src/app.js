
const express = require('express');
const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/users', usersController.getTopUsers);

app.get('/posts', postsController.getPosts);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;