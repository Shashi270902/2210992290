/**
 * Service for processing user-related requests
 */
const httpClient = require('../utils/httpClient');
const cacheManager = require('../utils/cacheManager');
const config = require('../config');
const postService = require('./postService');

/**
 * Get all users from the evaluation service
 * @returns {Object} Object containing user data with IDs as keys
 */
async function getAllUsers() {
  // Check cache first
  const cachedUsers = cacheManager.get('allUsers');
  if (cachedUsers) {
    return cachedUsers;
  }
  
  try {
    const response = await httpClient.get('users');
    const users = response.users || {};
    
    // Store in cache
    cacheManager.set('allUsers', users);
    
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Get user data by ID
 * @param {string} userId - The user ID to fetch
 * @returns {Object} User data
 */
async function getUserById(userId) {
  const users = await getAllUsers();
  return { id: userId, name: users[userId] };
}

/**
 * Get top users by comment count on their posts
 * @returns {Array} Array of top user objects
 */
async function getTopUsersByComments() {
  // Get all users
  const users = await getAllUsers();
  const userIds = Object.keys(users);
  
  // Track comment counts for each user
  const userCommentCounts = {};
  
  // For each user, get their posts and count comments
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const posts = await postService.getPostsByUserId(userId);
        let totalComments = 0;
        
        // Count comments for each post
        for (const post of posts) {
          const comments = await postService.getCommentsByPostId(post.id);
          totalComments += comments.length;
        }
        
        userCommentCounts[userId] = {
          id: userId,
          name: users[userId],
          commentCount: totalComments,
          postCount: posts.length
        };
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error.message);
        // Continue with other users even if one fails
      }
    })
  );
  
  // Sort users by comment count (descending)
  const sortedUsers = Object.values(userCommentCounts)
    .sort((a, b) => b.commentCount - a.commentCount)
    .slice(0, config.topUsersCount);
  
  return sortedUsers;
}

module.exports = {
  getAllUsers,
  getUserById,
  getTopUsersByComments
};