const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const User = require("../model/User").User; // import {Post} from "../model/Post";

module.exports = new EntitySchema({
    name: "User",
    target: User,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        urlAvatar:{
            type:"varchar",
            default:null
        },
        password: {
            type: "varchar"
        },
        email : {
            type:"varchar",
            unique:true
        },
        isModerator:{
            type:"boolean",
            default:false
        }
    }
});