const postModel = require('../model/post');
const { post } = require('../router/authRoutes');


class PostController {
    async addPost(req, res) {
        try {
            const { title, content, category, tags } = req.body;
            const userId = req.user._id;

            const newPost = new postModel({
                title,
                content,
                category,
                tags,
                author: userId
            })

            await newPost.save();

            return res.status(200).json({
                success: true,
                message: 'Post has been saved successfully',
                data: newPost
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async updatePost(req, res) {
        try {
            const { title, content, category, tags } = req.body;
            const userId = req.user._id;
            const postId = req.params.id;


            const updatedPost = await postModel.findByIdAndUpdate(postId, {
                title,
                content,
                category,
                tags,
                author: userId
            }, { new: true, runValidators: true })

            if (!updatedPost) {
                return res.status(404).json({
                    success: false,
                    message: 'Post is not found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Post has been updated successfully',
                data: updatedPost
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async deletePost(req, res) {
        try {
            const userId = req.user._id;
            const postId = req.params.id;

            const deletedPost = await postModel.findOneAndDelete({ _id: postId, author: userId });

            if (!deletedPost) {
                return res.status(404).json({
                    success: false,
                    message: 'Post is not found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Post has been deleted successfully',
                data: deletedPost
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async toggleLikePost(req, res) {
        try {
            const userId = req.user._id;
            const postId = req.params.id;

            const post = await postModel.findById(postId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post is not found'
                })
            }


            if (post.likedBy.includes(userId.toString())) {
                await postModel.findByIdAndUpdate(postId, {
                    $inc: { likes: -1 },
                    $pull: { likedBy: userId }
                })

                return res.status(200).json({
                    success: true,
                    message: 'Post like removed successfully'
                })

            } else {
                await postModel.findByIdAndUpdate(postId, {
                    $inc: { likes: 1 },
                    $push: { likedBy: userId }
                })

                return res.status(200).json({
                    success: true,
                    message: 'Post liked successfully'
                })
            }


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async getPostsSortedByLikes(req, res) {
        try {
            const posts = await postModel.aggregate([
                {
                    $sort: { likes: -1 }
                }
            ])

            return res.status(200).json({
                success: true,
                message: 'Posts has been fetched successfully',
                data: posts
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}

module.exports = new PostController();