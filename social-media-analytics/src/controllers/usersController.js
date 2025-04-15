/**
 * Controller for handling user-related requests
 */
const userService = require('../services/userService');

/**
 * Handles requests to retrieve top users by comment count
 */
async function getTopUsers(req, res) {
  try {
    // Get top users from the service
    const topUsers = await userService.getTopUsersByComments();
    
    // Return the result
    return res.status(200).json({ users: topUsers });
  } catch (error) {
    console.error(`Error in getTopUsers controller: ${error.message}`);
    
    // Return appropriate error response
    return res.status(500).json({ error: 'Failed to retrieve top users' });
  }
}

module.exports = {
  getTopUsers
};