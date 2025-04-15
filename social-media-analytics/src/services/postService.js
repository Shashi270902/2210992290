/**
 * Service for processing post-related requests
 */
const httpClient = require('../utils/httpClient');
const cacheManager = require('../utils/cacheManager');
const config = require('../config');

// In-memory store for post data
let postsCache = {
  byId: {},           // Posts indexed by ID
  byUser: {},         // Posts indexed by user ID
  commentsByPost: {}, // Comments indexed by post ID
  latestPosts: [],    // Array of most recent posts
  mostCommented: []   // Array of most commented posts
};

/**
 * Get posts by user ID
 * @param {string} userId - The user ID to fetch posts for
 * @returns {Array} Array of post objects
 */
async function getPostsByUserId(userId) {
  // Check cache first
  const cacheKey = `userPosts_${userId}`;
  const cachedPosts = cacheManager.get(cacheKey);
  if (cachedPosts) {
    return cachedPosts;
  }
  
  try {
    const response = await httpClient.get(`users/${userId}/posts`);
    const posts = response.posts || [];
    
    // Update cache
    cacheManager.set(cacheKey, posts);
    
    // Update in-memory store
    postsCache.byUser[userId] = posts;
    
    // Update individual post cache
    posts.forEach(post => {
      postsCache.byId[post.id] = {
        ...post,
        timestamp: new Date().getTime()
      };
    });
    
    // Update latest posts
    updateLatestPosts(posts);
    
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    throw new Error(`Failed to fetch posts for user ${userId}`);
  }
}

/**
 * Get comments for a post
 * @param {string} postId - The post ID to fetch comments for
 * @returns {Array} Array of comment objects
 */
async function getCommentsByPostId(postId) {
  // Check cache first
  const cacheKey = `postComments_${postId}`;
  const cachedComments = cacheManager.get(cacheKey);
  if (cachedComments) {
    return cachedComments;
  }
  
  try {
    const response = await httpClient.get(`posts/${postId}/comments`);
    const comments = response.comments || [];
    
    // Update cache
    cacheManager.set(cacheKey, comments);
    
    // Update in-memory store
    postsCache.commentsByPost[postId] = comments;
    
    // Update most commented posts
    updateMostCommentedPosts(postId, comments.length);
    
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }
}

/**
 * Get the most popular posts (posts with most comments)
 * @returns {Array} Array of popular post objects
 */
async function getPopularPosts() {
  // If we have cached popular posts with comment counts, use them
  if (postsCache.mostCommented.length > 0) {
    return postsCache.mostCommented;
  }
  
  // Otherwise, we need to build this data
  // For the purpose of this example, we'll just fetch some posts and their comments
  try {
    // Get some users
    const users = await httpClient.get('users');
    const userIds = Object.keys(users.users).slice(0, 5); // Take a few users
    
    // For each user, get their posts
    const allPosts = [];
    for (const userId of userIds) {
      const posts = await getPostsByUserId(userId);
      allPosts.push(...posts);
    }
    
    // For each post, get comment count
    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const comments = await getCommentsByPostId(post.id);
        return {
          ...post,
          commentCount: comments.length
        };
      })
    );
    
    // Sort by comment count and find the maximum
    postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
    
    if (postsWithComments.length > 0) {
      const maxCommentCount = postsWithComments[0].commentCount;
      
      // Filter posts with max comment count
      const mostCommentedPosts = postsWithComments.filter(
        post => post.commentCount === maxCommentCount
      );
      
      // Update cache
      postsCache.mostCommented = mostCommentedPosts;
      
      return mostCommentedPosts;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching popular posts:', error.message);
    throw new Error('Failed to fetch popular posts');
  }
}

/**
 * Get the latest posts
 * @returns {Array} Array of latest post objects
 */
async function getLatestPosts() {
  // If we have cached latest posts and they're recent, use them
  if (postsCache.latestPosts.length >= config.latestPostsCount) {
    return postsCache.latestPosts.slice(0, config.latestPostsCount);
  }
  
  // Otherwise, build the latest posts data
  try {
    // Get some users
    const users = await httpClient.get('users');
    const userIds = Object.keys(users.users).slice(0, 5); // Take a few users
    
    // For each user, get their posts
    

// For each user, get their posts
const allPosts = [];
for (const userId of userIds) {
  const posts = await getPostsByUserId(userId);
  allPosts.push(...posts);
}

// Add timestamp to each post if not already present
const postsWithTimestamp = allPosts.map(post => ({
  ...post,
  timestamp: post.timestamp || new Date().getTime()
}));

// Sort by timestamp (newest first)
postsWithTimestamp.sort((a, b) => b.timestamp - a.timestamp);

// Take only the latest posts
const latestPosts = postsWithTimestamp.slice(0, config.latestPostsCount);

// Update cache
postsCache.latestPosts = latestPosts;

return latestPosts;
} catch (error) {
console.error('Error fetching latest posts:', error.message);
throw new Error('Failed to fetch latest posts');
}
}

/**
* Update the latest posts cache with new posts
* @param {Array} newPosts - Array of new posts to consider
*/
function updateLatestPosts(newPosts) {
// Add timestamp to new posts
const timestamp = new Date().getTime();
const postsWithTimestamp = newPosts.map(post => ({
...post,
timestamp
}));

// Combine with existing latest posts
const allPosts = [...postsCache.latestPosts, ...postsWithTimestamp];

// Sort by timestamp (newest first)
allPosts.sort((a, b) => b.timestamp - a.timestamp);

// Update latest posts cache (keep only the top N)
postsCache.latestPosts = allPosts.slice(0, config.latestPostsCount);
}

/**
* Update the most commented posts cache with new comment count
* @param {string} postId - The post ID
* @param {number} commentCount - The number of comments
*/
function updateMostCommentedPosts(postId, commentCount) {
// Get the post from cache
const post = postsCache.byId[postId];
if (!post) return;

// Add comment count to post
const postWithComments = {
...post,
commentCount
};

// If most commented is empty or this post has more comments than the current most commented
if (
postsCache.mostCommented.length === 0 ||
commentCount > postsCache.mostCommented[0].commentCount
) {
// New maximum - replace all current most commented
postsCache.mostCommented = [postWithComments];
} 
// If this post has the same number of comments as the current most commented
else if (commentCount === postsCache.mostCommented[0].commentCount) {
// Add to most commented if not already present
const exists = postsCache.mostCommented.some(p => p.id === postId);
if (!exists) {
  postsCache.mostCommented.push(postWithComments);
}
}
}

module.exports = {
getPostsByUserId,
getCommentsByPostId,
getPopularPosts,
getLatestPosts
};