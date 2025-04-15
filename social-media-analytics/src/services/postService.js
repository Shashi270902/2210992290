
const httpClient = require('../utils/httpClient');
const cacheManager = require('../utils/cacheManager');
const config = require('../config');

let postsCache = {
  byId: {},           
  byUser: {},         
  commentsByPost: {}, 
  latestPosts: [],   
  mostCommented: []   
};


async function getPostsByUserId(userId) {
  
  const cacheKey = `userPosts_${userId}`;
  const cachedPosts = cacheManager.get(cacheKey);
  if (cachedPosts) {
    return cachedPosts;
  }
  
  try {
    const response = await httpClient.get(`users/${userId}/posts`);
    const posts = response.posts || [];
  
    cacheManager.set(cacheKey, posts);
    
    postsCache.byUser[userId] = posts;
    
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


async function getPopularPosts() {
  
  if (postsCache.mostCommented.length > 0) {
    return postsCache.mostCommented;
  }
  

  try {
  
    const users = await httpClient.get('users');
    const userIds = Object.keys(users.users).slice(0, 5); 
    
   
    const allPosts = [];
    for (const userId of userIds) {
      const posts = await getPostsByUserId(userId);
      allPosts.push(...posts);
    }
    
   
    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const comments = await getCommentsByPostId(post.id);
        return {
          ...post,
          commentCount: comments.length
        };
      })
    );
    
    postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
    
    if (postsWithComments.length > 0) {
      const maxCommentCount = postsWithComments[0].commentCount;
      
      const mostCommentedPosts = postsWithComments.filter(
        post => post.commentCount === maxCommentCount
      );
      
      postsCache.mostCommented = mostCommentedPosts;
      
      return mostCommentedPosts;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching popular posts:', error.message);
    throw new Error('Failed to fetch popular posts');
  }
}


async function getLatestPosts() {
  if (postsCache.latestPosts.length >= config.latestPostsCount) {
    return postsCache.latestPosts.slice(0, config.latestPostsCount);
  }
  
  try {
    const users = await httpClient.get('users');
    const userIds = Object.keys(users.users).slice(0, 5); 
    
    

const allPosts = [];
for (const userId of userIds) {
  const posts = await getPostsByUserId(userId);
  allPosts.push(...posts);
}

const postsWithTimestamp = allPosts.map(post => ({
  ...post,
  timestamp: post.timestamp || new Date().getTime()
}));

postsWithTimestamp.sort((a, b) => b.timestamp - a.timestamp);

const latestPosts = postsWithTimestamp.slice(0, config.latestPostsCount);

postsCache.latestPosts = latestPosts;

return latestPosts;
} catch (error) {
console.error('Error fetching latest posts:', error.message);
throw new Error('Failed to fetch latest posts');
}
}


function updateLatestPosts(newPosts) {
const timestamp = new Date().getTime();
const postsWithTimestamp = newPosts.map(post => ({
...post,
timestamp
}));

const allPosts = [...postsCache.latestPosts, ...postsWithTimestamp];

allPosts.sort((a, b) => b.timestamp - a.timestamp);

postsCache.latestPosts = allPosts.slice(0, config.latestPostsCount);
}


function updateMostCommentedPosts(postId, commentCount) {
const post = postsCache.byId[postId];
if (!post) return;

const postWithComments = {
...post,
commentCount
};

if (
postsCache.mostCommented.length === 0 ||
commentCount > postsCache.mostCommented[0].commentCount
) {
postsCache.mostCommented = [postWithComments];
} 
else if (commentCount === postsCache.mostCommented[0].commentCount) {
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