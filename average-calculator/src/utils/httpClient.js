
const axios = require('axios');
const config = require('../config');

let authCredentials = null;

async function register() {
  try {
    const response = await axios.post(`${config.serverUrl}/register`, {
      email: process.env.EMAIL || "your-email@example.com",
      name: process.env.NAME || "Your Name",
      mobileNo: process.env.MOBILE || "9999999999",
      githubUsername: process.env.GITHUB_USERNAME || "your-github-username",
      rollNo: process.env.ROLL_NO || "your-roll-number",
      collegeName: process.env.COLLEGE_NAME || "Your College",
      accessCode: process.env.ACCESS_CODE || "your-access-code"
    });
    
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw new Error('Failed to register with evaluation service');
  }
}

async function authenticate() {
  try {
   
    if (!authCredentials) {
     
      authCredentials = {
        email: process.env.EMAIL || "your-email@example.com",
        name: process.env.NAME || "Your Name",
        rollNo: process.env.ROLL_NO || "your-roll-number",
        accessCode: process.env.ACCESS_CODE || "your-access-code",
        clientID: process.env.CLIENT_ID || "your-client-id",
        clientSecret: process.env.CLIENT_SECRET || "your-client-secret"
      };
    }
    
    const response = await axios.post(`${config.serverUrl}/auth`, authCredentials);
    
    config.accessToken = response.data.access_token;
    
    return config.accessToken;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with evaluation service');
  }
}

async function fetchNumbers(endpoint) {
  try {
  
    if (!config.accessToken) {
      await authenticate();
    }
   
    const response = await axios.get(`${config.serverUrl}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      },
      timeout: config.timeoutLimit
    });
    
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out');
    }
    
    
    if (error.response?.status === 401) {
      await authenticate();
      return fetchNumbers(endpoint);
    }
    
    console.error(`Error fetching ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch ${endpoint}`);
  }
}

module.exports = {
  register,
  authenticate,
  fetchNumbers
};