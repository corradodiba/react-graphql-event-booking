
const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');

const getEventsByIds = async eventIds => {
    const events = await Event.find({_id: {$in:  eventIds}});
    events.map(event => {
        return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: getUserById.bind(this, event.creator) 
        };
    });
    return events;
}

const getEventById = async eventId => {
    const event = await Event.findById(eventId);
    return {
        ...event._doc,
        creator: getUserById.bind(this, event._doc.creator)
    };
}

const getUserById = async userId => {
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
            return { 
                ...event._doc, 
                date: new Date(event.date).toISOString(), 
                creator: getUserById.bind(this, event.creator) 
            }
        });
    },
    bookings: async () => {
        const bookings = await Booking.find();
        return bookings.map(booking => {
            return {
                ...booking._doc,
                event: getEventById.bind(this, booking._doc.event),
                user: getUserById.bind(this, booking._doc.user),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            };
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
                creator: getUserById.bind(this, result.creator)
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
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            event: fetchedEvent,
            user: '5dc32bbe48fd24578284f62e',
        });
        const result = await booking.save();
        return {
            ...result._doc,
            event: getEventById.bind(this, result._doc.event),
            user: getUserById.bind(this, result._doc.user),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },
    cancelBooking: async args => {
        const fetchedBooking = await Booking.findById(args.bookingId).populate('event');
        const event = {
            ...fetchedBooking.event._doc,
            creator: getUserById.bind(this, fetchedBooking.event.creator)
        }
        await Booking.deleteOne({ _id: args.bookingId});
        return event;
    }
}