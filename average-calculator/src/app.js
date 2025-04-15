/**
 * Express application setup for the Average Calculator microservice
 */
const express = require('express');
const numbersController = require('./controllers/numbersController');

// Create Express application
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Numbers endpoint - accepts number type as parameter
app.get('/numbers/:type', numbersController.getNumbers);

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