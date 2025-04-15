
const userService = require('../services/userService');


async function getTopUsers(req, res) {
  try {
    const topUsers = await userService.getTopUsersByComments();
    
    return res.status(200).json({ users: topUsers });
  } catch (error) {
    console.error(`Error in getTopUsers controller: ${error.message}`);
    
    return res.status(500).json({ error: 'Failed to retrieve top users' });
  }
}

module.exports = {
  getTopUsers
};