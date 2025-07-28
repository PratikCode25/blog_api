const userModel = require('../model/user');
const fs = require('fs').promises;

class UserController {

    async UpdateUserProfile(req, res) {
        try {
            const userId = req.user._id;

            const { name, bio } = req.body;

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User is not found'
                })
            }

            // console.log(req.file)

            const picturePath = req.file.path ? req.file.path : user.profilePicture;

            const updatedUser = await userModel.findByIdAndUpdate(userId, {
                name,
                bio,
                profilePicture: picturePath
            }, { new: true, runValidators: true })


            if (req.file && user.profilePicture) {
                try {
                    await fs.access(user.profilePicture);
                    await fs.unlink(user.profilePicture)
                } catch (error) {
                    console.log('Old image not deletd')
                }
            }

            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: user
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async getUserProfile(req, res) {
        try {
            const userId = req.user;
            const user = await userModel.findById(userId).select('-password -isVerified -otp');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User is not found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'User profile data is fetched successfully',
                data: user
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

}

module.exports = new UserController();
