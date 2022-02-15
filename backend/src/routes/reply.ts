import * as express from "express";
import * as PublicationController from "../controller/PublicationController";
import * as ReplyController from "../controller/ReplyController";
import auth from "../middleware/auth";
const router = express.Router();

router.get('/', auth, ReplyController.getAllReply ); //utilise l'id de la publication passé dans le body de la req.
router.post('/', auth, ReplyController.createReply ); //utilise l'id de la publication passé dans le body de la req. 
router.post('/:idReply', auth, ReplyController.createReply ); //utilise l'id du comm passé dans l'adresse (permet de faire la distinction). 
router.get('/:idReply', auth, ReplyController.getOneReply ); 
router.put('/:idReply', auth, ReplyController.modifyReply );
router.delete('/:idReply', auth, ReplyController.deleteReply );

module.exports = router;