const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

module.exports = (req, res, next) => {
    try {
        const token = Cookies(req,res).get('access_token');
        const decodedToken = jwt.verify(token, 'MON_TOKEN_SECRET');
        const userId = decodedToken.userId;
        const isModerator = decodedToken.isModerator;
        req.auth = { userId, isModerator };
        if (req.body.id && req.body.id !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!').message
        });
    }
};