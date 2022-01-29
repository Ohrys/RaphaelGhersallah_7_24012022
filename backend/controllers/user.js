const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
const bcrypt = require('bcrypt');
const getManager = require("typeorm").getManager;
const User = require('../src/entity/User');



exports.registerUser = (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = getManager().create(User,{
            name:req.body.name,
            password: hash,
            email:req.body.email
        });
        
        getManager().save(user)
            .then(() => res.status(201).json({message:'Utilisateur Enregistré'}))
            .catch(error => res.status(400).json({error}));
    })
    .catch((error)=>next(error));
}

exports.loginUser = (req,res,next) =>{
    getManager().findOneOrFail(User,{ email:req.body.email })
    .then( user =>{
        bcrypt.compare(req.body.password,user.password)
        .then(valid =>{
            if(!valid){
                return res.status(401).json({error:'Identifiant incorrects'});
            }
            
            let jwt_token = jwt.sign({
                    userId : user.id,
                    isModerator : user.isModerator,
                    lastConnection : new Date().getTime()
                },
                'MON_TOKEN_SECRET',
                {
                    expiresIn:604800
                }
            );

            new Cookies(req,res).set('access_token',jwt_token,{
                httpOnly:true
            });

            let decodedToken = jwt.verify(jwt_token, 'MON_TOKEN_SECRET');//--- FOR DEV
            res.status(200).json({
                user,
                jwt_token, //----- FOR DEV
                decodedToken //----- FOR DEV
            })
        })
        .catch(error => next(error));
    })
    .catch(()=>res.status(404).json({error:'Identifiants incorrects'}));
}

exports.modifyUser = (req,res,next)=>{
    if(req.body.id == req.params.id){        
        delete req.body.id;
        let userObject = { ...req.body};
        getManager().update(User,{id: req.params.id}, { ... userObject })
            .then(() => res.status(200).json({ message: "Utilisateur Modifié !" }))
            .catch(error => next(error));
    }else{
        return res.status(401).json({message:"vous n'êtes pas l'utilisateur de la requête."});
    }
}