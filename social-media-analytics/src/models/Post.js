
class Post {
 
    constructor(id, userId, content) {
      this.id = id;
      this.userId = userId;
      this.content = content;
      this.comments = [];
      this.timestamp = new Date().getTime();
    }
  
 
    addComment(comment) {
      this.comments.push(comment);
    }
  
 
    getComments() {
      return this.comments;
    }
  
    getCommentCount() {
      return this.comments.length;
    }
  

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