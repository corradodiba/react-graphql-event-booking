
const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');

const getEventsByIds = eventIds => {
    return Event.find({_id: {$in:  eventIds}}).then(events => {
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event.date).toISOString(),
                creator: getUser.bind(this, event.creator) 
            };
        });
    });
}
const getUser = userId => {
    return User.findById(userId).then(user => {
        return {
            ...user._doc,
            createdEvents: getEventsByIds.bind(this, user.createdEvents)
        };
    });
}

module.exports = {
    events: () => {
        return Event.find().then(events => {
            return events.map(event => {
                console.log(event._doc)
                return { ...event._doc, date: new Date(event.date).toISOString(), creator: getUser.bind(this, event.creator) }
            });
        });
    },
    createEvent: args => {
        let createEvent;
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
            creator: '5dc32bbe48fd24578284f62e'
        });
        return event.save().then(event => {
            createEvent = { 
                ...event._doc,
                date: new Date(event.date).toISOString(),
                creator: getUser.bind(this, event.creator)
            }
            return User.findById('5dc32bbe48fd24578284f62e')
        })
        .then(user => {
            if (!user) {
                throw new Error('User not found!')
            }
            user.createdEvents.push(event);
            return user.save()
        })
        .then(() => {
            return createEvent;
        })
        .catch(err => {
            throw err
        });
    },
    createUser: args => {
        return User.findOne({email: args.userInput.email} || {username: args.userInput.username}).then(user => {
            if (user) {
                throw new Error('User exists already!');
            }
            return bcrypt.hash(args.userInput.password, 12);
        })
        .then(hashedPwd => {
            const user = new User({
                username: args.userInput.username,
                email: args.userInput.email,
                password: hashedPwd
            });
            return user.save();
        })
        .then(user => {
            console.log(user);
            return { ...user._doc, password: null }
        })
        .catch(err => {
            throw err
        });
    }
}