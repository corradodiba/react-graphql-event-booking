
const bcrypt = require('bcryptjs');

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
    }
}