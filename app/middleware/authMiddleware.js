const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {

        const token = authHeader.split(' ')[1];
        // console.log(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
            })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            })
        }

    } else {
        return res.status(401).json({
            success: false,
            message: 'Token is required'
        })
    }

}   

module.exports={authenticate}