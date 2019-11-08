const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { 
    dateToString,
    getEventById, 
    getUserById, 
    customizeEvent 
} = require('../helpers/merge');

const customizeBooking = booking => {
    return {
        ...booking._doc,
        event: getEventById.bind(this, booking._doc.event),
        user: getUserById.bind(this, booking._doc.user),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

module.exports = {
    bookings: async () => {
        const bookings = await Booking.find();
        return bookings.map(booking => {
            return customizeBooking(booking);
        });
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            event: fetchedEvent,
            user: '5dc55e27a9f2c18584d35496',
        });
        const result = await booking.save();
        return customizeBooking(result);
    },
    cancelBooking: async args => {
        const fetchedBooking = await Booking.findById(args.bookingId).populate('event');
        const event = customizeEvent(fetchedBooking.event);
        await Booking.deleteOne({ _id: args.bookingId});
        return event;
    }
}