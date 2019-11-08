exports.isAuth = (authStatus) => {
    if (!authStatus) {
        throw new Error('Not Authenticated!');
    }
}