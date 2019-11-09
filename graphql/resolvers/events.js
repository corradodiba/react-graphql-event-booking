const Event = require('../../models/event');
const User = require('../../models/user');
const  { customizeEvent } = require('../helpers/merge');
const { isAuth } = require('../helpers/auth-error-handler');

exports.eventsQueries = {
    events: async () => {
        const events = await Event.find();
        return events.map(event => {
            return customizeEvent(event);
        });
    }
}
    
exports.eventsMutations = {
    createEvent: async ( _, args, req ) => {
        isAuth(req.isAuth);
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
            creator: req.userId
        });
        let createEvent;
        try {
            const result = await event.save();
            createEvent = customizeEvent(result);
            const user = await User.findById(req.userId);
            if (!user) {
                throw new Error('User not found!')
            }
            user.createdEvents.push(event);
            await user.save();
            return createEvent;
        } catch (err) {
            throw err;
        }
    }
}