const categoryModel = require('../model/category');

class CategoryController {

    async addCategory(req, res) {
        try {
            const { name, description } = req.body;
            const newCategory = new categoryModel({
                name,
                description
            })

            await newCategory.save();

            return res.status(200).json({
                success: true,
                message: 'Blog Category has been added successfully',
                data: newCategory
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async getAllcategoriesWithPosts(req, res) {
        try {
            const result = await categoryModel.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        foreignField: 'category',
                        localField: '_id',
                        as: 'postDetails'
                    }
                },
                {
                    $addFields:{totalPosts:{$size:'$postDetails'}}
                }
                
            ])

            return res.status(200).json({
                success: true,
                message: 'Categories and their post data fetched',
                data: result
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

}

module.exports = new CategoryController();