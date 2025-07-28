const express=require('express');
const router=express.Router();
const AuthController = require('../controller/AuthController');

router.post('/register',AuthController.register);
router.put('/verify-email',AuthController.verfifyEmail);
router.post('/login',AuthController.login);


module.exports=router;