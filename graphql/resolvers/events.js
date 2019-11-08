const Event = require('../../models/event');
const User = require('../../models/user');
const  { customizeEvent } = require('../helpers/merge');

module.exports = {
    events: async () => {
        const events = await Event.find();
        return events.map(event => {
            return customizeEvent(event);
        });
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
            creator: '5dc55e27a9f2c18584d35496'
        });
        let createEvent;
        try {
            const result = await event.save();
            createEvent = customizeEvent(result);
            const user = await User.findById('5dc55e27a9f2c18584d35496');
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