/**
 * Express application setup for the Social Media Analytics microservice
 */
const express = require('express');
const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');

// Create Express application
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Users endpoint - get top users
app.get('/users', usersController.getTopUsers);

// Posts endpoint - get posts by type (popular/latest)
app.get('/posts', postsController.getPosts);

// Handle 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;