import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as Cookies from "cookies";

export function getAll(request: Request, response: Response, next: NextFunction){
    getRepository(User).find()
     .then((result)=>response.status(200).json(result))
     .catch((error)=>response.status(400).json(error));
}

export function getOne(request: Request, response: Response, next: NextFunction) {
    getRepository(User).findOne(request.params.id)
     .then((result)=>response.status(200).json(result))
     .catch((error)=>response.status(404).json(error));
}

export function registerUser(req:Request, res:Response, next:Function){
    let user = new User();
    bcrypt.hash(req.body.password, 10)
     .then(hash => {
        user.name = req.body.name;
        user.password = hash;
        user.email = req.body.email;
         user.lastConnection = new Date().getTime().toString();
        getRepository(User).save(user)
         .then(()=>res.status(201).json({message : "L'utilisateur a bien été enregistré !"}))
         .catch((error)=>res.status(500).json(error));
     })
     .catch((error) => next(error));
}

export function loginUser(req:Request, res:Response, next:Function){
    getRepository(User).findOneOrFail({ email: req.body.email })
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Identifiant incorrects' });
                    }
                    user.lastConnection = new Date().getTime().toString();
                    getRepository(User).save(user)
                    .catch(error=>next(error));

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
                    res.status(200).json({user});
                    console.log(user.isModerator);
                })
                .catch(error => next(error));
        })
        .catch(() => res.status(404).json({ error: 'Identifiants incorrects' }));
}

export function modifyUser(req, res, next) {
    if (req.body.idUser == req.params.id||req.auth.isModerator) {
        getRepository(User).findOne(req.body.userId)
         .then((user)=>{
            delete req.body.userId;
            user = {...req.body};
            if(req.body.password){
                bcrypt.hash(req.body.password, 10)
                 .then(hash => { 
                    user.password = hash;
                    getRepository(User).save(user)
                     .then(() => res.status(202).json({ message: "Utilisateur modifié" }))
                    .catch((error) => next(error));
                 })
                .catch(error => res.status(500).json({message : 'erreur lors du hashage'}));
                
            }else{
                getRepository(User).save(user)
                 .then(() => res.status(202).json({ message: "Utilisateur modifié" }))
                .catch((error) => next(error));
            }
         })
        .catch((error)=>next(error));
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête." });
    }
}

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
            .catch(error => res.status(404).json({ message: "Aucun utilisateur avec cet identifiant : "+error }))
    } else {
        return res.status(401).json({ message: "vous n'êtes pas l'utilisateur de la requête." });
    }
}
