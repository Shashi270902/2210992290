
/**
 * Configuration for the Average Calculator microservice
 */
module.exports = {
    // Size of the sliding window for number storage
    windowSize: 10,
    
    // Base URL for the evaluation service
    serverUrl: 'http://20.244.56.144/evaluation-service',
    
    // Timeout limit for API requests (in milliseconds)
    timeoutLimit: 500,
    
    // Access token for server authentication (to be populated at runtime)
    accessToken: null
  };