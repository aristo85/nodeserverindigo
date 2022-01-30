const jwt = require('jsonwebtoken');
const { config } = require('../config');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error("Not authenticated!");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodeToken = jwt.verify(token, config.jwtSecret);
        if (!decodeToken) {
            const error = new Error("Not authenticated!");
            error.statusCode = 401;
            throw error;
        }

        req.userId = decodeToken.userId;
        next();
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

}