
require('dotenv').config();
const app = require('./app');
const httpClient = require('./utils/httpClient');

const PORT = process.env.PORT || 9876;

async function startServer() {
  try {
    await httpClient.authenticate();
    console.log('Successfully authenticated with the evaluation service');
    
    app.listen(PORT, () => {
      console.log(`Average Calculator service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();