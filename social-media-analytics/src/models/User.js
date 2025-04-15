
class User {
 
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.posts = [];
      this.commentCount = 0;
    }
  

    addPost(post) {
      this.posts.push(post);
    }
  
  
    addComments(count) {
      this.commentCount += count;
    }
  

    getPosts() {
      return this.posts;
    }

    getCommentCount() {
      return this.commentCount;
    }
  

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