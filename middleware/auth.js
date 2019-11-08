const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    let isAuth = false;
    const authFieldHeader = req.get('Authorization');

    if(authFieldHeader === undefined) {
        req.isAuth = isAuth;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(authFieldHeader, 'this_is_a_long_secret_key');
    } catch (err) {
        req.isAuth = isAuth;
        return next()
    }

    if (decodedToken) {
        isAuth = true;
    }

    req.isAuth = isAuth;
    req.userId = decodedToken.userId;
    next();
};