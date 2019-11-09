const { usersQueries, usersMutations } = require('./resolvers/users');
const { eventsQueries, eventsMutations } = require('./resolvers/events');
const { bookingQueries, bookingMutations } = require('./resolvers/booking');

const rootResolver = {
    rootQuery: {
        ...usersQueries,
        ...eventsQueries,
        ...bookingQueries

    },
    rootMutation: {
        ...usersMutations,
        ...eventsMutations,
        ...bookingMutations
    }
}

module.exports = rootResolver;