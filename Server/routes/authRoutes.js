const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.post('refresh', authController.refresh);


module.exports = router;