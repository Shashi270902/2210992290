/**
 * Server entry point for the Average Calculator microservice
 */
require('dotenv').config();
const app = require('./app');
const httpClient = require('./utils/httpClient');

// Set default port or use environment variable
const PORT = process.env.PORT || 9876;

// Function to start the server
async function startServer() {
  try {
    // Attempt to authenticate with the evaluation service before starting
    await httpClient.authenticate();
    console.log('Successfully authenticated with the evaluation service');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Average Calculator service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();