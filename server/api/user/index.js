const express = require('express');

const userController = require('./user.controller')
const protect = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/auth', userController.authUser);
router.post('/logout', userController.logoutUser);
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;