class Comment {
    constructor(id, content, like, lastUpdate, author, replyToPost, replyToComment) {
        this.id = id;
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

/*
"INSERT INTO `comment`(
    `id`,
     `content`,
      `lastUpdate`,
       `like`,
        `authorId`,
         `replyToPostId`,
          `replyToCommentId`)
        VALUES 
    (DEFAULT,
         'ceci est une réponse. de l\\'auteur 2',
          1643669221005,
           '0',
            2,
             2,
            NULL)"
        */