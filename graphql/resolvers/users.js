
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            let userResult = await User.findOne({email: args.userInput.email} || {username: args.userInput.username});
            if (userResult) {
                throw new Error('User exists already!');
            }
            const hashedPwd = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPwd
            });
            userResult = await user.save();
            return { 
                ...user._doc, 
                password: null 
            }
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const fetchedUser = await User.findOne({email: email});
        if(!fetchedUser) {
            throw new Error('User does not exist!');
        }

        const isValidPwd = await bcrypt.compare(password, fetchedUser.password);
        if(!isValidPwd) {
            throw new Error('Incorrect password!');
        }

        const token = jwt.sign({userId: fetchedUser._id, email: fetchedUser.email}, 'this_is_a_long_secret_key', {
            expiresIn: '1h'
        });

        return {
            userId: fetchedUser._id,
            token,
            dateExpiration: 1
        }
        
    }
}