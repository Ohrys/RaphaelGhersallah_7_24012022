const EntitySchema = require("typeorm").EntitySchema;
const Comment = require("../model/Comment").Comment;

module.exports = new EntitySchema({
    name: "Comment",
    target: Comment,
    columns:{
        id:{
            primary: true,
            type: "int",
            generated: true
        },
        content:{
            type:"varchar"
        },
        lastUpdate:{
            type:"varchar",
            length:"20"
        },
        like:{
            type:"json"
        }
    },
    relations: {
        author: {
            target: "User",
            type: "many-to-one",
            joinTable: true,
            onDelete: "cascade"
        },
        replyToPost:{
            target:"Post",
            type:"many-to-one",
            joinTable: true,
            onDelete: "cascade"
        },
        commentReplying:{
            type:"one-to-many",
            target: "Comment",
            inverseSide:'replyToComment'
        },
        replyToComment:{
            target: "Comment",
            type: "many-to-one",
            joinColumn:{
                name:"comment_id"
            },
            onDelete:"cascade",
            inverseSide:'commentReplying'
        }
    }
})