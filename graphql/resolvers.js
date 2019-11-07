
const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');

const getEventsByIds = async eventIds => {
    const events = await Event.find({_id: {$in:  eventIds}});
    events.map(event => {
        return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: getUser.bind(this, event.creator) 
        };
    });
    return events;
}
const getUser = async userId => {
    const user = await User.findById(userId);
    return {
        ...user._doc,
        createdEvents: getEventsByIds.bind(this, user._doc.createdEvents)
    };
}

module.exports = {
    events: async () => {
        const events = await Event.find();
        return events.map(event => {
            console.log(event)
            return { 
                ...event._doc, 
                date: new Date(event.date).toISOString(), 
                creator: getUser.bind(this, event.creator) 
            }
        });
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
            creator: '5dc32bbe48fd24578284f62e'
        });
        let createEvent;
        try {
            const result = await event.save();
            createEvent = {
                ...result,
                date: new Date(result.date).toISOString(),
                creator: getUser.bind(this, result.creator)
            }
            const user = await User.findById('5dc32bbe48fd24578284f62e');
            if (!user) {
                throw new Error('User not found!')
            }
            user.createdEvents.push(event);
            await user.save();
            return createEvent;
        } catch (err) {
            throw err;
        }
    },
    createUser: async args => {
        try {
            let userResult = await User.findOne({email: args.userInput.email} || {username: args.userInput.username});
            if (user) {
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
                ...userResult._doc, 
                password: null 
            }
        } catch (err) {
            throw err;
        }
    }
}