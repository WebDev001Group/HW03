const express = require('express');
const verifySignUp = require('../middleware/verifySignUp');
const verifyJwtToken = require("../middleware/authTokenMiddleWare");
const authController = require('../controllers/auth.controller');

const authRoutes = express.Router();

authRoutes.use("/register", verifySignUp.checkUsernameDuplicate);
authRoutes.use("/register", verifySignUp.checkInvalidPassword)

authRoutes.post('/register', authController.signUp);
authRoutes.post('/login', authController.signIn);
authRoutes.post('/refresh', authController.refresh);


module.exports = authRoutes;