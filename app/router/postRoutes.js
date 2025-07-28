const express=require('express');
const router=express.Router();

const {authenticate}=require('../middleware/authMiddleware');
const PostController = require('../controller/PostController');


router.get('/',PostController.getPostsSortedByLikes);
router.post('/add',authenticate,PostController.addPost);
router.put('/:id/update',authenticate,PostController.updatePost);
router.delete('/:id/delete',authenticate,PostController.deletePost);
router.put('/:id/toggle-like',authenticate,PostController.toggleLikePost);

module.exports=router;