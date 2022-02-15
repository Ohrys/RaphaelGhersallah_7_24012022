import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Publication } from "../entity/Publication";

export function getAllPublication(req:Request, res:Response, next:NextFunction){
    getRepository(Publication).find({
        order: {
            lastUpdate: "DESC"
        },
        relations:['author','replies'],
        take: 20
    })
        .then(posts => res.status(200).json({ posts }))
        .catch(error => res.status(500).json({ error: "Impossible d'obtenir les informations." }));
}

export function getOnePublication(req:Request, res:Response, next:NextFunction){
    getRepository(Publication).findOne(req.params.id,{relations:['author']})
        .then(post => res.status(200).json({ post }))
        .catch(error => res.status(404).json({ error: "identifiant invalide" }));
}

export function createPublication(req, res:Response, next:NextFunction){
    let publication = new Publication();
        publication = {
        ...req.body,
        lastUpdate: new Date().getTime().toString(),
        creationDate: new Date().getTime().toString(),
        like: 0,
        author: req.auth.idUser
    }
    if(publication.author){
        getRepository(Publication).save(publication)
            .then(() => res.status(201).json({ message: 'Post Enregistré' }))
            .catch(error => res.status(400).json({ error }));
    }else{
        res.status(500).json({message:'error, pas d auteur'});
    }
}


export function modifyPublication(req, res, next){
    if (req.auth.isModerator || req.auth.idUser == req.body.author) {
        let publication = new Publication();
        publication = {
            ...req.body,
            lastUpdate: new Date().getTime().toString()
        };
        getRepository(Publication).update(req.params.id, { ...publication })
            .then(() => res.status(200).json({ message: "Post Modifié !" }))
            .catch(error => next(error));
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce post." });
    }
}

export function deletePublication(req, res, next) {
    getRepository(Publication).findOne(req.params.id,{relations:['author']})
     .then(publication => {
         if (req.auth.isModerator || req.auth.idUser == publication.author.idUser) {
             getRepository(Publication).delete(req.params.id)
                 .then(() => res.status(200).json({ message: "Post supprimé avec succès." }))
                 .catch(error => res.status(500).json({ error: "une erreur est survenue " }));
         } else {
             return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce post." });
         }
     })
     .catch(error => res.status(404).json({message:"Le post n'existe pas"+error}));
}