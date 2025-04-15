
const postService = require('../services/postService');


async function getPosts(req, res) {
  try {
    const { type } = req.query;
    
   
    if (!type || !['popular', 'latest'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid post type. Must be either "popular" or "latest"' 
      });
    }
    
    let posts;
    if (type === 'popular') {
 
      posts = await postService.getPopularPosts();
    } else {
      posts = await postService.getLatestPosts();
    }
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(`Error in getPosts controller: ${error.message}`);
    
    return res.status(500).json({ error: 'Failed to retrieve posts' });
  }
}

module.exports = {
  getPosts
};