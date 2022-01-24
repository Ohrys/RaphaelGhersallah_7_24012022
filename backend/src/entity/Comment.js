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
            type:"varchar"
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
            cascade: true
        },
        replyToPost:{
            target:"Post",
            type:"many-to-one",
            joinTable: true,
            cascade: true
        },
        replyToComment:{
            target: "Comment",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
})