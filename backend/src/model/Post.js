class Post {
    constructor(id, title, content, like, lastUpdate, author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.like = like;
        this.lastUpdate = lastUpdate;
        this.author = author;
    }
}

module.exports = {
    Post: Post
};