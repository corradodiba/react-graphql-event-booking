const jwt = require('jsonwebtoken');

exports.authentication = request => {
    let isAuth = false;
    let userId;
    const authFieldHeader = request.headers.authorization;
    if(authFieldHeader === undefined) {
        request.isAuth = isAuth;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(authFieldHeader, 'this_is_a_long_secret_key');
    } catch (err) {
        request.isAuth = isAuth;
    }

    if (decodedToken) {
        isAuth = true;
        userId = decodedToken.userId;
    }
    return {
      isAuth: isAuth,
      userId
    }
};