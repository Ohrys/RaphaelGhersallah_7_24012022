const express = require('express');
const router = express.Router();
const ctrlPost = require('../controllers/post');
const ctrlComment = require('../controllers/comment');
const auth = require('../middleware/auth');

router.get('/', auth, ctrlPost.getAllPost);
router.get('/:id', auth, ctrlPost.getOnePost);
router.post('/', auth, ctrlPost.createPost);
router.put('/:id', auth, ctrlPost.modifyPost);
router.delete('/:id', auth, ctrlPost.deletePost);

router.post('/:id/comments/reply', auth, ctrlComment.createComment);
router.get('/:id/comments', auth, ctrlComment.getFirstLevelComment);
router.get('/:id/comments/:idComment', auth, ctrlComment.getNextLevelComment);
router.put('/:id/comments/:idComment/modify', auth, ctrlComment.modifyComment);
router.delete('/:id/comments/:idComment/delete', auth, ctrlComment.deleteComment);

module.exports = router;