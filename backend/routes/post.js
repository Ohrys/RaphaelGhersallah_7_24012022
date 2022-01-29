const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/post');
const auth = require('../middleware/auth');

router.get('/', auth, ctrlPost.getAllPost);
router.get('/:id', auth, ctrlPost.getOnePost);
router.post('/', auth, ctrlPost.createPost);
router.put('/:id', auth, ctrlPost.modifyPost);
router.delete('/:id', auth, ctrlPost.deletePost);

module.exports = router;