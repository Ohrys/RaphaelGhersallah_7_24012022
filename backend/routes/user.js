const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', ctrlUser.registerUser);
router.post('/login', ctrlUser.loginUser);
router.put('/:id/modify', auth, ctrlUser.modifyUser);

module.exports = router;