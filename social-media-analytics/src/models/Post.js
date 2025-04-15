/**
 * Post model
 */
class Post {
    /**
     * Create a new Post
     * @param {string} id - Post ID
     * @param {string} userId - User ID
     * @param {string} content - Post content
     */
    constructor(id, userId, content) {
      this.id = id;
      this.userId = userId;
      this.content = content;
      this.comments = [];
      this.timestamp = new Date().getTime();
    }
  
    /**
     * Add a comment to the post
     * @param {Object} comment - The comment to add
     */
    addComment(comment) {
      this.comments.push(comment);
    }
  
    /**
     * Get the post's comments
     * @returns {Array} The post's comments
     */
    getComments() {
      return this.comments;
    }
  
    /**
     * Get the comment count for the post
     * @returns {number} The number of comments
     */
    getCommentCount() {
      return this.comments.length;
    }
  
    /**
     * Convert the post to a plain object
     * @returns {Object} Plain object representation of the post
     */
    toJSON() {
      return {
        id: this.id,
        userId: this.userId,
        content: this.content,
        commentCount: this.comments.length,
        timestamp: this.timestamp
      };
    }
  }
  
  module.exports = Post;