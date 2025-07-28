const express=require('express');
const router=express.Router();
const CategoryController = require('../controller/CategoryController');

const {authenticate}=require('../middleware/authMiddleware');

// router.use(authenticate);
router.post('/add',authenticate,CategoryController.addCategory);
router.get('/',CategoryController.getAllcategoriesWithPosts)


module.exports=router;