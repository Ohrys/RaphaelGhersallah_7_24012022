const getManager = require("typeorm").getManager;
const Comment = require('../src/entity/Comment');

exports.getFirstLevelComment = (req, res, next) =>{
    getManager().find(Comment, {
        where: {
            replyToPost: req.params.id,
        },
        relations: ["author","commentReplying"],
        order: {
            lastUpdate: "DESC"
        },
        limit:10
    })
        .then(comments => {
            console.log(comments);
            res.status(200).json({comments});
        })
        .catch(error => res.status(500).json({ error: "Impossible d'obtenir les informations." }));
}

exports.getNextLevelComment = (req, res, next) => {
    getManager().find(Comment, {
        where: {
            replyToComment: req.params.idComment,
        },
        relations: ["author","commentReplying"],
        order: {
            lastUpdate: "DESC"
        },
        limit: 10
    })
        .then(comments => {
            console.log(comments);
            res.status(200).json({ comments });
        })
        .catch(error => res.status(500).json({ error: "Impossible d'obtenir les informations." }));
}



exports.createComment = (req, res, next) => {
    const ReplyTo = req.params.id;
    let comment = getManager().create(Comment);
    comment.content = req.body.content;
    comment.lastUpdate = new Date().getTime();
    comment.like = 0;
    comment.author = req.auth.userId;
    if (req.body.replyTo) {
        comment.replyToComment = parseInt(req.body.replyTo);
        comment.replyToPost = null;
    }else{
        comment.replyToComment = null;
        comment.replyToPost = parseInt(ReplyTo);
    }
        getManager().save(comment)
            .then(() => res.status(201).json({ message: 'Comment Enregistré' }))
            .catch(error => res.status(400).json({ error }));
}

exports.modifyComment = (req, res, next) => {
    if (req.auth.isModerator || req.auth.authorId == req.body.authorId) {
        delete req.body.authorId;
        let commentObject = {
            ...req.body,
            lastUpdate: new Date().getTime()
        };
        getManager().update(Comment, { id: req.params.idComment }, { ...commentObject })
            .then(() => res.status(200).json({ message: "Comment Modifié !" }))
            .catch(error => next(error));
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce commentaire." });
    }
}

exports.deleteComment = (req, res, next) => {
    if (req.auth.isModerator || req.auth.authorId == req.body.authorId) {
        getManager().delete(Comment, { id: req.params.idComment })
            .then(() => res.status(200).json({ message: "Comment supprimé avec succès." }))
            .catch(error => res.status(500).json({ error: "une erreur est survenue " }));
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce commentaire." });
    }
}