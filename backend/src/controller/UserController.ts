import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Cookies from "cookies";

/** Non utilisée - récupère la liste de tout les utilisateur
 * @param void
 * @returns {User[]} un tableau d'utilisateur au format json
 */
export function getAll(request: Request, response: Response, next: NextFunction){
    getRepository(User).find()
     .then((result)=>response.status(200).json(result))
     .catch((error)=>response.status(400).json({message: "erreur obtention User[] : "+ error}));
}

/** Non utilisée - récupère l'utilisateur passé par params url
 * @param {String} uuid utilistateur passé dans les params url
 * @return {User} un utilisateur
 */
export function getOne(request: Request, response: Response, next: NextFunction) {
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
         .then(()=>res.status(201).json({message : "User enregistré"}))
         .catch((error)=>res.status(500).json({message : "erreur dans l'enregistrement User : "+error}));
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
                    getRepository(User).save(user)
                    .catch(error => res.status(400).json({message : "Erreur màj lastConnection : " + error}));

                    let jwt_token = jwt.sign({
                        idUser: user.idUser,
                        isModerator: user.isModerator,
                        lastConnection: new Date().getTime()
                    },
                        'MON_TOKEN_SECRET' // -- DEV : à modifier avec un dotenv
                    );

                    Cookies(req, res).set('access_token', jwt_token, {
                        httpOnly: true,
                        maxAge: 3600000*24
                    });
                    res.status(200).json(user);
                })
                .catch(error => res.status(400).json({message : "Erreur encryptage password : "+ error}));
        })
        .catch(error => res.status(404).json({ message: 'Identifiants incorrects : ' + error }));
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
                        ...JSON.parse(req.body.user),
                        urlAvatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
                        .then(()=>res.status(202).json({message:"l'utilisateur a été modifié avec succès"}))
                    .catch(error => res.status(401).json("Erreur de modification User : "+error));
                }else{
                    return res.status(412).json({message:"Vous n'êtes pas le possesseur de ce compte"});
                }
            })
        .catch(error => res.status(404).json({message:"une erreur est survenue : "+ error}))
    }else{
        // il n'y en a pas les données sont accessible via req.body
        if (req.body.idUser == req.params.id || req.auth.isModerator) {
            getRepository(User).findOne(req.body.userId)
                .then((user) => {
                    delete req.body.userId;
                    user = { ...req.body };
                    if (req.body.password) {
                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                user.password = hash;
                                getRepository(User).save(user)
                                    .then(() => res.status(202).json({ message: "Utilisateur modifié" }))
                                    .catch((error) => res.status(400).json({message : "Erreur modification (w/ password) User : "+ error}));
                            })
                            .catch(error => res.status(500).json({ message: 'erreur lors du hashage : '+ error }));

                    } else {
                        getRepository(User).save(user)
                            .then(() => res.status(202).json({ message: "Utilisateur modifié" }))
                            .catch((error) => res.status(400).json({message : "Erreur modification User : "+error}));
                    }
                })
                .catch((error) => res.status(404).json({message:"Erreur obtention User : "+ error}));
        } else {
            return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête." });
        }
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
                    getRepository(User).remove(user)
                        .then(()=>res.status(203).json({message:'Utilisateur supprimé avec succès'}))
                }else{
                    return res.status(500).json({message:'une erreur est survenue'})
                }
            })
            .catch(error => res.status(404).json({ message: "Erreur obtention User : "+error }))
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête." });
    }
}
