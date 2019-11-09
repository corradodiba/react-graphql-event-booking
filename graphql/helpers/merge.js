const Event = require('../../models/event');
const User = require('../../models/user');

exports.dateToString = date => {
    return new Date(date).toISOString();
}

exports.customizeEvent = event => {
    return {
        ...event._doc,
        date: this.dateToString(event._doc.date),
        creator: this.getUserById.bind(this, event.creator)
    };
};

exports.getEventsByIds = async eventIds => {
    const events = await Event.find({_id: {$in:  eventIds}});
    return events.map(event => {
        return this.customizeEvent(event);
    });
};

exports.getEventById = async eventId => {
    const event = await Event.findById(eventId);
    return this.customizeEvent(event);
}

exports.getUserById = async userId => {
    const user = await User.findById(userId);
    return {
        ...user._doc,
        password: null,
        createdEvents: this.getEventsByIds.bind(this, user.createdEvents)
    };
}