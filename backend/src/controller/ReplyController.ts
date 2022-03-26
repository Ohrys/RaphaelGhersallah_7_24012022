import { getRepository } from "typeorm";
import { Reply } from "../entity/Reply";
import { Publication } from "../entity/Publication";


/** retourne un tableau contenant tout les commentaire d'une publication.
 * @param {String} uuid uuid de la publication passé en paramètre de la request
 * @returns {Reply[]} Un tableau de Reply au format json
 */
export function getAllReply(req, res, next) {
    getRepository(Reply).find({
        where: { 
            replyToP: req.params.idPublication 
        }, 
        order: {
            creationDate: "DESC"
        },
        relations: ['author'] })
        .then(replies =>{
            if(replies){
                res.status(200).json(replies)
            }else{
                res.status(404).json({message : "aucun commentaire associé : " + replies});
            }
        })
    .catch(error => res.status(412).json({ message: "Erreur Obtention Reply[] (publi) : " + error }));
}


/** Retourne une Reply et ses Reply
 * @param {String} uuid uuid d'une Reply passé en paramètre url
 * @return {Reply[]} un tableau de Reply au format json
 */
export function getOneReply(req, res, next){
    getRepository(Reply).findOne(req.params.id, {relations:['author','replies']})
        .then((reply)=>res.status(200).json(reply))
    .catch((error)=>res.status(404).json({message: 'Erreur Obtention Reply[] (reply) : '+ error}))
}

/** Crée une Reply à une Publication ou une Reply. 
 * @param {String} uuid un uuid soit dans les params d'une url (réponse à une Reply) soit dans le body (réponse à une Publication)
 * @param {String} content le contenu d'une reply
 * @return {String} un message au format json
 */
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
    .catch(error => res.status(500).json({ message: 'Erreur enregistrement Reply : ' + error }));
}


/** Modifie la Reply passé par paramètre - Non utilisé
 * @param {String} uuid uuid d'une Reply passé par params url 
 * @return {String} un message au format json
 */
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
                .catch(error => res.status(500).json({message: 'Erreur modification Reply : '+ error}));
            } else {
                return res.status(401).json({message: "vous n'êtes pas l'auteur de ce commentaire." });
            }
        })
    .catch(error => res.status(404).json({message:'Pas de Reply trouvé pour cet id :'+ error}))
    
}

/** Supprime une Reply passé en paramètre
 * @param {String} uuid uuid d'une Reply passé par params url
 * @return {String} un message au format json
 */
export function deleteReply(req, res, next) {
    getRepository(Reply).findOne(req.params.idReply,{relations:['author']})
        .then(reply => {
            if (req.auth.isModerator || req.auth.idUser == reply.author.idUser) {
                getRepository(Reply).delete({idReply:req.params.idReply})
                    .then(() => res.status(200).json({message: "Post supprimé avec succès." }))
                    .catch(error => res.status(500).json({message: "Erreur suppression Reply : "+error }));
            } else {
                return res.status(401).json({message: "vous n'êtes pas l'auteur de ce post." });
            }
        })
    .catch(error => res.status(404).json({message: "Le post n'existe pas" + error }));
}