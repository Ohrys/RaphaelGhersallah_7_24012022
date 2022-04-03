import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Cookies from "cookies";
const fs = require('fs');

/** Récupère l'utilisateur via le cookie par mesure de sécurité
 * @param {void} none - les requêtes étant sécurisées par cookie,
 *                      on se sert de l'id contenu dans le cookie pour renvoyer l'utilisateur connecté.
 * @return {User} un utilisateur
 */
export function getLoggedUser(req, res){
    if(req.auth.idUser){
        getRepository(User).findOne(req.auth.idUser)
         .then((result)=>res.status(200).json(result))
         .catch((error)=>res.status(404).json({message:"erreur obtention User logged : "+error}));
    }else{
        return res.status(401).json({ message: "erreur obtention User logged " })
    }
}
/** Non utilisée - récupère l'utilisateur passé par params url
 * @param {String} uuid utilistateur passé dans les params url
 * @return {User} un utilisateur
 */
export function getOne(request: Request, response: Response) {
    getRepository(User).findOne(request.params.id)
     .then((result)=>response.status(200).json(result))
     .catch((error)=>response.status(404).json({message : "erreur obtention User : "+error}));
}

/** Enregistre un utilisateur
 * @param {Request.body}any les champs pour l'enregistrement d'un utilisateur
 * @return {String} un message au format json
 */
export function registerUser(req:Request, res:Response, next:Function){
    let user = new User();
    bcrypt.hash(req.body.password, 10)
     .then(hash => {
        user.name = req.body.name;
        user.password = hash;
        user.email = req.body.email;
         user.lastConnection = new Date().getTime().toString();
        getRepository(User).save(user)
         .then(()=>res.status(201).json({message : "User enregistré",status:1}))
         .catch((error)=>res.status(500).json({message : "erreur dans l'enregistrement User : "+error, status:-1}));
     })
     .catch((error) => next(error));
}

/** Connecte un utilisateur et lui crée un token stocké en cookie HTTPonly
 * @param {String}email l'email d'un utilisateur 
 * @param {String}password le mot de passe d'un utilisateur
 * @return {User} l'utilisateur qui vient de se connecter (temporaire, affichera un message au format json)
 */
export function loginUser(req:Request, res:Response, next:Function){
    getRepository(User).findOneOrFail({ email: req.body.email })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Identifiant incorrects' });
                    }
                    user.lastConnection = new Date().getTime().toString();
                    console.log(process.env.TOKEN)
                    getRepository(User).save(user)
                        .catch(error => res.status(400).json({ message: "Erreur màj lastConnection : " + error, status: -1}));
                        let jwt_token = jwt.sign({
                            idUser: user.idUser,
                            isModerator: user.isModerator,
                            lastConnection: new Date().getTime()
                        },
                        process.env.TOKEN, 
                        {expiresIn: 60 * 60 * 48 } // Expiration date : 2days
                    );
                    console.log('here');

                    delete user.password, user.isModerator;
                    res.status(200).json({user,jwt_token,status:1});
                })
                .catch(error => res.status(400).json({message : "Erreur encryptage password : "+ error,status:-1}));
        })
        .catch(error => res.status(404).json({ message: 'Identifiants incorrects : ' + error, status: -1}));
}

/** Modifie un utilisateur
 * @param {String} uuid un uuid utilisateur passé en paramètre url 
 * @param {Request.body} any les champs modifiéde l'utilisateur 
 * @return {String} un message au format json
 */
export function modifyUser(req, res, next) {
    if(req.file){ // s'il y a une image on traite la requête différemment. 
        getRepository(User).findOne(req.params.id)
            .then(user =>{
                if (req.auth.isModerator || req.auth.idUser == user.idUser) {
                    getRepository(User).update(user,{
                        name :req.body.name,
                        email: req.body.email,
                        urlAvatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
                        .then(()=>res.status(202).json({user,message:"l'utilisateur a été modifié avec succès",status:1}))
                    .catch(error => res.status(401).json({message:"Erreur de modification User : "+error,status:-1}));
                }else{
                    return res.status(412).json({ message: "Vous n'êtes pas le possesseur de ce compte", status: -1});
                }
            })
        .catch(error => res.status(404).json({message:"une erreur est survenue : "+ error,status:-1}))
    }else{
        // il n'y en a pas les données sont accessible via req.body
        getRepository(User).findOne(req.params.id)
            .then((user) => {
                if (req.auth.isModerator || req.auth.idUser == req.params.id) {
                    getRepository(User).update(user, {
                        name:req.body.name,
                        email:req.body.email
                    })
                        .then(() => res.status(202).json({user, message: "Utilisateur modifié", status:1 }))
                    .catch((error) => res.status(400).json({message : "Erreur modification User : "+ error, status:-1}));
                } else {
                    return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête." , status:-1});
                }
            })
            .catch((error) => res.status(404).json({message:"Erreur obtention User : "+ error, status:-1}));
    }
}

/** Supprime un utilisateur
 * @param {String} uuid un uuid utilisateur passé en paramètre url 
 * @return {String} un message au format json
 */
export function deleteUser(req, res, next){
    if (req.body.idUser == req.params.id || req.auth.isModerator) {
        getRepository(User).findOne(req.body.idUser)
            .then(user =>{
                if(user){
                    const filename = user.urlAvatar.split('/images/')[1];
                    fs.unlink(`images/${filename}`,()=>{
                        getRepository(User).remove(user)
                            .then(()=>res.status(203).json({message:'Utilisateur supprimé avec succès',status:1}))
                    })
                }else{
                    return res.status(500).json({ message: 'une erreur est survenue', status: -1})
                }
            })
            .catch(error => res.status(404).json({ message: "Erreur obtention User : " + error, status: -1 }))
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête.", status: -1 });
    }
}
