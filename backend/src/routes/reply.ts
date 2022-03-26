import * as express from "express";
import * as ReplyController from "../controller/ReplyController";
import auth from "../middleware/auth";
const router = express.Router();

router.get('/:idPublication', auth, ReplyController.getAllReply ); 
router.post('/', auth, ReplyController.createReply ); 
router.post('/:idReply', auth, ReplyController.createReply ); 
router.get('/one/:idReply', auth, ReplyController.getOneReply );
/* router.put('/:idReply', auth, ReplyController.modifyReply ); -- non utilisé en front */
router.delete('/:idReply', auth, ReplyController.deleteReply );
module.exports = router;