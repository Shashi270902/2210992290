
const express = require('express');
const numbersController = require('./controllers/numbersController');

const app = express();

// Parse JSON request bodies
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/numbers/:type', numbersController.getNumbers);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;