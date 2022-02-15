import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Reply } from "../entity/Reply";
import { Publication } from "../entity/Publication";

export function getAllReply(req, res, next) {
    getRepository(Publication).findOne(req.body.idPublication, { relations: ['replies'] })
        .then(post =>{
            if(post && post.replies){
                res.status(200).json(post.replies)
            }else{
                res.status(404).json({message : "aucun commentaire associé : " + post});
            }
        })
    .catch(error => res.status(412).json({ message: "identifiant invalide " + error }));
}

export function getOneReply(req, res, next){
    getRepository(Reply).findOne(req.params.id, {relations:['replies']})
        .then((replies)=>res.status(200).json(replies))
    .catch((error)=>res.status(404).json({message: 'Aucun replies trouvés : '+ error}))
}

export function createReply(req, res, next) {
    let reply = new Reply();
    reply = {
        ...req.body,
        creationDate: new Date().getTime().toString(),
        lastUpdate: new Date().getTime().toString(),
        like: 0,
        author: req.auth.idUser,
    };
    if(req.params.idReply){
        reply.replyToR = req.params.idReply
    }else{
        reply.replyToP = req.body.idPublication
    }
    getRepository(Reply).save(reply)
        .then(()=> res.status(201).json({message:"Enregistrement Reply effectué"}) )
    .catch(error => res.status(500).json({ message: 'Problème enregistrement Reply : ' + error }));
}

export function modifyReply(req, res, next) {
    getRepository(Reply).findOne(req.params.id)
        .then(reply =>{
            if (req.auth.isModerator || req.auth.idUser == reply.author) {
                let replyObj = new Reply();
                replyObj = {
                    ...req.body,
                    lastUpdate: new Date().getTime().toString()
                };
                getRepository(Reply).update(reply, { ...replyObj })
                    .then(() => res.status(200).json({message: "Reply Modifié !" }))
                .catch(error => res.status(500).json({message: 'Une erreur est survenue : '+ error}));
            } else {
                return res.status(401).json({message: "vous n'êtes pas l'auteur de ce commentaire." });
            }
        })
    .catch(error => res.status(404).json({message:'Pas de Reply trouvé pour cet id :'+ error}))
    
}

export function deleteReply(req, res, next) {
    getRepository(Reply).findOne(req.params.id)
        .then(reply => {
            if (req.auth.isModerator || req.auth.idUser == reply.author.idUser) {
                getRepository(Reply).delete(reply)
                    .then(() => res.status(200).json({message: "Post supprimé avec succès." }))
                    .catch(error => res.status(500).json({message: "une erreur est survenue "+error }));
            } else {
                return res.status(401).json({message: "vous n'êtes pas l'auteur de ce post." });
            }
        })
    .catch(error => res.status(404).json({message: "Le post n'existe pas" + error }));
}