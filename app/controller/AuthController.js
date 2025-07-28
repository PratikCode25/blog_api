const userModel = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const transporter = require('../config/configEamil');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            const registerValidation = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            })

            const { error, value } = registerValidation.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                })
            }

            const existsUser = await userModel.findOne({ email });
            if (existsUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User is already exists'
                })
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const otp = Math.floor(1000 + Math.random() * 9000);

            const newUser = new userModel({
                name,
                email,
                password: hashPassword,
                otp: otp
            })

            await newUser.save();
            const text = `Verifcation otp for email is : ${otp} `;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: newUser.email,
                subject: 'Node.js test project- Email verify',
                text: text
            })

            return res.status(200).json({
                success: true,
                message: 'User is registered successfully.Check email and verify',
                otp: otp
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async verfifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User Not found'
                })
            }

            if (user.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'User is already verified'
                })
            }

            if (user.otp !== otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Otp is not valid, please check'
                })
            }

            const updatedUser = await userModel.findOneAndUpdate({ email: email, otp: otp }, { isVerified: true, otp: null }, { new: true });

            if (updatedUser) {
                return res.status(200).json({
                    success: true,
                    message: 'Email verfied successfully'
                })
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                })
            }

            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User does not exist'
                })
            }

            if(!user.isVerified){
                 return res.status(400).json({
                    success: false,
                    message: 'User is not verified'
                })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Password is not matched'
                })
            }

            const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });

            return res.status(200).json({
                success: true,
                message: 'Log-in is successfull',
                token: token
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}

module.exports = new AuthController();