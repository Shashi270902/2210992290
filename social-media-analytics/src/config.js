/**
 * Configuration for the Social Media Analytics microservice
 */
module.exports = {
    // Base URL for the evaluation service
    serverUrl: 'http://20.244.56.144/evaluation-service',
    
    // Timeout limit for API requests (in milliseconds)
    timeoutLimit: 5000,
    
    // Access token for server authentication (to be populated at runtime)
    accessToken: null,
    
    // Cache TTL (Time To Live) in seconds
    cacheTTL: 60,
    
    // Number of top users to return
    topUsersCount: 5,
    
    // Number of latest posts to return
    latestPostsCount: 5
  };