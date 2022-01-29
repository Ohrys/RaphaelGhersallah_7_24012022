const getManager = require("typeorm").getManager;
const Post = require('../src/entity/Post');

exports.getAllPost = (req, res, next) =>{
    getManager().find(Post,{
        order:{
            lastUpdate:"DESC"
        },
        take:20})
    .then(posts => res.status(200).json({posts}))
    .catch(error => res.status(500).json({error : "Impossible d'obtenir les informations."}));
};

exports.getOnePost = (req, res, next) =>{
    getManager().findOneOrFail(Post,{id:req.params.id})
    .then(post => res.status(200).json({post}))
    .catch(error => res.status(404).json({error : "identifiant invalide"}));
}

exports.createPost = (req, res, next) =>{
    let post = getManager().create(Post,{
        ...req.body,
        lastUpdate : new Date().getTime(),
        like:0,
        authorId: req.auth.userId
    });

    getManager().save(post)
        .then(() => res.status(201).json({ message: 'Post Enregistré' }))
        .catch(error => res.status(400).json({ error }));
}

exports.modifyPost = (req, res, next) =>{
    if(req.auth.isModerator || req.auth.authorId == req.body.authorId){
        let postObject = { 
            ...req.body,
            lastUpdate : new Date().getTime()
        };
        getManager().update(Post, { id: req.params.id }, { ...postObject })
            .then(() => res.status(200).json({ message: "Post Modifié !" }))
            .catch(error => next(error));
    }else{
        return res.status(401).json({message:"vous n'êtes pas l'auteur de ce post."});
    }
}

exports.deletePost = (req, res, next) => {
    if (req.auth.isModerator || req.auth.authorId == req.body.authorId) {
        getManager().delete(Post,{id:req.params.id})
        .then(()=>res.status(200).json({message:"Post supprimé avec succès."}))
        .catch(error => res.status(500).json({error:"une erreur est survenue "}));
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce post." });
    }
}