class Comment {
    constructor(id, title, content, like, lastUpdate, author, replyToPost, replyToComment) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.lastUpdate = lastUpdate;
        this.like = like;
        this.author = author;
        this.replyToPost = replyToPost;
        this.replyToComment = replyToComment;
    }
}

module.exports = {
    Comment: Comment
};