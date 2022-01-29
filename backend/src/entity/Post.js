const EntitySchema = require("typeorm").EntitySchema;
const Post = require("../model/Post").Post;

module.exports = new EntitySchema({
    name: "Post",
    target: Post,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar"
        },
        content: {
            type: "text"
        },
        lastUpdate: {
            type: "varchar",
            length:"20"
        },
        like: {
            type: "json"
        },
    },
    relations:{
        authorId:{
            target:"User",
            type:"many-to-one",
            joinTable:true,
            cascade: true
        }
    }
})