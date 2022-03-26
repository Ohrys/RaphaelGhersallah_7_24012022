import * as express from "express";
import * as PublicationController from "../controller/PublicationController";
import auth from "../middleware/auth";
const multer = require('../middleware/multer-config');
const router = express.Router();


router.get('/', auth, PublicationController.getAllPublication );
router.get('/:id', auth, PublicationController.getOnePublication );
router.post('/', auth, multer,PublicationController.createPublication );
/* router.put('/:id', auth, PublicationController.modifyPublication );  -- non utilisé en front*/
router.delete('/:id', auth, PublicationController.deletePublication);


module.exports = router;