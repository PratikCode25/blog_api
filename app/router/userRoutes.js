const express=require('express');
const userController = require('../controller/userController');
const imageUpload=require('../helper/imageUpload');
const {authenticate}=require('../middleware/authMiddleware');
const router=express.Router();

router.use(authenticate);
router.get('/profile',userController.getUserProfile);
router.put('/profile-update',imageUpload.single('profilePicture'),userController.UpdateUserProfile);

module.exports=router;