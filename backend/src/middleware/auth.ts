const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

export default (req, res, next) => {
    try {
        const token = Cookies(req, res).get('access_token');
        const decodedToken = jwt.verify(token, 'MON_TOKEN_SECRET');
        const idUser = decodedToken.idUser;
        const isModerator = decodedToken.isModerator;
        req.auth = { idUser, isModerator };
        if (!isModerator && (req.body.idUser && req.body.idUser !== idUser)) {
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