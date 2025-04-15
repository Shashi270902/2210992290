
const axios = require('axios');
const config = require('../config');

// Store authentication credentials
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
    
    // Get auth token
    const response = await axios.post(`${config.serverUrl}/auth`, authCredentials);
    
    // Store the token in config for future requests
    config.accessToken = response.data.access_token;
    
    return config.accessToken;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with evaluation service');
  }
}


async function makeRequest(endpoint, options = {}) {
  try {
    // Ensure we have a valid access token
    if (!config.accessToken) {
      await authenticate();
    }
    
    // Set up request config
    const requestConfig = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${config.accessToken}`
      },
      timeout: config.timeoutLimit
    };
    
    // Make the request
    const response = await axios({
      method: options.method || 'get',
      url: `${config.serverUrl}/${endpoint}`,
      ...requestConfig
    });
    
    return response.data;
  } catch (error) {
    // Handle auth errors
    if (error.response?.status === 401) {
      // Try to re-authenticate and retry once
      await authenticate();
      return makeRequest(endpoint, options);
    }
    
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Failed to call ${endpoint}`);
  }
}


async function get(endpoint, options = {}) {
  return makeRequest(endpoint, { ...options, method: 'get' });
}

async function post(endpoint, data, options = {}) {
  return makeRequest(endpoint, { ...options, method: 'post', data });
}

module.exports = {
  register,
  authenticate,
  get,
  post
};