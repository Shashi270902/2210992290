
const httpClient = require('../utils/httpClient');
const cacheManager = require('../utils/cacheManager');
const config = require('../config');
const postService = require('./postService');


async function getAllUsers() {
  const cachedUsers = cacheManager.get('allUsers');
  if (cachedUsers) {
    return cachedUsers;
  }
  
  try {
    const response = await httpClient.get('users');
    const users = response.users || {};
    
    cacheManager.set('allUsers', users);
    
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    throw new Error('Failed to fetch users');
  }
}


async function getUserById(userId) {
  const users = await getAllUsers();
  return { id: userId, name: users[userId] };
}


async function getTopUsersByComments() {
  
  const users = await getAllUsers();
  const userIds = Object.keys(users);
  
  const userCommentCounts = {};
  
  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const posts = await postService.getPostsByUserId(userId);
        let totalComments = 0;
        
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
      }
    })
  );
  
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