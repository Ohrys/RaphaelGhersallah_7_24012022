import * as express from "express";
import * as PublicationController from "../controller/PublicationController";
import auth from "../middleware/auth";
const router = express.Router();


router.get('/', auth, PublicationController.getAllPublication );
router.get('/:id', auth, PublicationController.getOnePublication );
router.post('/', auth, PublicationController.createPublication );
router.put('/:id', auth, PublicationController.modifyPublication );
router.delete('/:id', auth, PublicationController.deletePublication);


module.exports = router;