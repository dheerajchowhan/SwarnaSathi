const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authControllers.js');
const { protect } = require('../middlewares/auth.js');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
module.exports = router;
