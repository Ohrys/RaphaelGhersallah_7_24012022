import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Publication } from "../entity/Publication";
const fs = require('fs');

/** Accède à une liste de max. 20 Publication ordonné par date de création
 * @param void
 * @returns {Publication[]} au format json
 */
export function getAllPublication(req:Request, res:Response, next:NextFunction){
    getRepository(Publication).find({
            order: {
                creationDate: "DESC"
            },
            relations:['author','replies']
        })
        .then(posts => res.status(200).json(posts))
    .catch(error => res.status(500).json({ message: "Erreur obtention Publication[] : "+ error }));
}


/** Retourne une publication et ses commentaires associés
 * @param {String} uuid transmis par les paramètres de l'adresse
 * @returns {Publication} au format json
 */
export function getOnePublication(req:Request, res:Response, next:NextFunction){
    getRepository(Publication).findOne(req.params.id,{relations:['author','replies']})
        .then(post => res.status(200).json( post ))
        .catch(error => res.status(404).json({ message: "Erreur obtention Publication : "+ error }));
}

/** Crée une publication 
 * @param {String} title - titre de la publication
 * @param {String} content - contenu de la publication
 * @returns {message:String} au format json
 */
export function createPublication(req, res:Response, next:NextFunction){
    if(req.file){
        let publication = new Publication();
            publication.title = req.body.title;
            publication.content = req.body.content;
            publication.illustration= `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            publication.lastUpdate= new Date().getTime().toString();
            publication.creationDate= new Date().getTime().toString();
            publication.like= 0;
            publication.author= req.auth.idUser
        if (publication.author) {
            getRepository(Publication).save(publication)
                .then(() => res.status(201).json({ message: 'Publication Enregistré', status: 1 }))
                .catch(error => res.status(400).json({ message: "Erreur création Publication : " + error, status: -1 }));
        } else {
            res.status(500).json({ message: "erreur pas d'auteur", status: -1 });
        }
    }else{
        let publication = new Publication();
        publication = {
            ...req.body,
            lastUpdate: new Date().getTime().toString(),
            creationDate: new Date().getTime().toString(),
            like: 0,
            author: req.auth.idUser
        }
        if (publication.author) {
            getRepository(Publication).save(publication)
                .then(() => res.status(201).json({ message: 'Publication Enregistré', status: 1 }))
                .catch(error => res.status(400).json({ message: "Erreur création Publication : " + error, status: -1 }));
        } else {
            res.status(500).json({ message: "erreur pas d'auteur", status: -1 });
        }
    }
}

/** Modifie une publication - Non utilisé
 * @param {Request.body} any champs à modifier, passé par le body de la requête et un uuid passé par les paramètres de l'adresse
 * @returns {String} message au format json
 */
export function modifyPublication(req, res, next){
    getRepository(Publication).findOne(req.params.id, { relations: ['author'] })
        .then(publication => {
            if (req.auth.isModerator || req.auth.idUser == publication.author.idUser) {
                getRepository(Publication).update(publication,{...req.body,lastUpdate: new Date().getTime().toString()})
                    .then(() => res.status(200).json({ message: "Post Modifié avec succès." }))
                .catch(error => res.status(500).json({ message : "Erreur Modification Publication : "+ error }));
            } else {
                return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce post." });
            }
        })
        .catch(error => res.status(404).json({message : "Erreur Obtention Publication : "+error}));
}

/** Supprime une publication
 * @param {String} uuid uuid passé par les paramètres de l'adresse
 * @returns {String} message au format json
 */
export function deletePublication(req, res, next) {
    getRepository(Publication).findOne(req.params.id,{relations:['author']})
     .then(publication => {
         if (req.auth.isModerator || req.auth.idUser == publication.author.idUser) {
             const filename = publication.illustration.split('/images/')[1];
             fs.unlink(`images/${filename}`, () => {
                getRepository(Publication).delete(req.params.id)
                    .then(() => res.status(200).json({ message: "Post supprimé avec succès." }))
                    .catch(error => res.status(500).json({ message: "Erreur Suppression Publication : "+error }));
             });
         } else {
             return res.status(401).json({ message: "vous n'êtes pas l'auteur de ce post." });
         }
     })
     .catch(error => res.status(404).json({message:"Erreur Obtention Publication : "+error}));
}