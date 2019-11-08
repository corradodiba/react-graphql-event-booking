const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { 
    dateToString,
    getEventById, 
    getUserById, 
    customizeEvent 
} = require('../helpers/merge');
const { isAuth } = require ('../helpers/auth-error-handler');

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
        isAuth(req.isAuth);
        const bookings = await Booking.find();
        return bookings.map(booking => {
            return customizeBooking(booking);
        });
    },
    bookEvent: async args => {
        isAuth(req.isAuth);
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            event: fetchedEvent,
            user: req.userId,
        });
        const result = await booking.save();
        return customizeBooking(result);
    },
    cancelBooking: async args => {
        isAuth(req.isAuth);
        const fetchedBooking = await Booking.findById(args.bookingId).populate('event');
        const event = customizeEvent(fetchedBooking.event);
        await Booking.deleteOne({ _id: args.bookingId});
        return event;
    }
}