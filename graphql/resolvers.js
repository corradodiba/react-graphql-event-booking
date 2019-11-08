const bookingResolver = require('./resolvers/booking');
const eventsResolver = require('./resolvers/events');
const usersResolver = require('./resolvers/users');

const rootResolver = {
    ...bookingResolver,
    ...eventsResolver,
    ...usersResolver
}

module.exports = rootResolver;