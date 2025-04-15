/**
 * User model
 */
class User {
    /**
     * Create a new User
     * @param {string} id - User ID
     * @param {string} name - User name
     */
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.posts = [];
      this.commentCount = 0;
    }
  
    /**
     * Add a post to the user
     * @param {Object} post - The post to add
     */
    addPost(post) {
      this.posts.push(post);
    }
  
    /**
     * Increment the user's comment count
     * @param {number} count - The number of comments to add
     */
    addComments(count) {
      this.commentCount += count;
    }
  
    /**
     * Get the user's posts
     * @returns {Array} The user's posts
     */
    getPosts() {
      return this.posts;
    }
  
    /**
     * Get the user's total comment count
     * @returns {number} The total comment count
     */
    getCommentCount() {
      return this.commentCount;
    }
  
    /**
     * Convert the user to a plain object
     * @returns {Object} Plain object representation of the user
     */
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        postCount: this.posts.length,
        commentCount: this.commentCount
      };
    }
  }
  
  module.exports = User;