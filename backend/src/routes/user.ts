import * as express from "express";
import * as UserController from  "../controller/UserController";
import auth from "../middleware/auth";
const multer = require('../middleware/multer-config');
const router = express.Router();

/* router.get('/',  UserController.getAll ); // inutilisée pour le moment */
router.get('/:id', UserController.getOne );
router.post('/signup', UserController.registerUser);
router.post('/login', UserController.loginUser ); 
router.put('/:id/modify', auth, multer, UserController.modifyUser ); 
router.delete('/:id/delete', auth, UserController.deleteUser ); 

module.exports = router;