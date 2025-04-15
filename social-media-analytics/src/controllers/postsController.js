/**
 * Controller for handling post-related requests
 */
const postService = require('../services/postService');

/**
 * Handles requests to retrieve posts based on type (popular/latest)
 */
async function getPosts(req, res) {
  try {
    const { type } = req.query;
    
    // Validate post type parameter
    if (!type || !['popular', 'latest'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid post type. Must be either "popular" or "latest"' 
      });
    }
    
    let posts;
    if (type === 'popular') {
      // Get most commented posts
      posts = await postService.getPopularPosts();
    } else {
      // Get latest posts
      posts = await postService.getLatestPosts();
    }
    
    // Return the result
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(`Error in getPosts controller: ${error.message}`);
    
    // Return appropriate error response
    return res.status(500).json({ error: 'Failed to retrieve posts' });
  }
}

module.exports = {
  getPosts
};