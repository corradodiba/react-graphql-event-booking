module.exports = `

    type AuthData {
        userId: ID!
        token: String!
        dateExpiration: Int!
    }

    type Booking {
        _id: ID!,
        event: Event!,
        user: User,
        createdAt: String!,
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type rootQuery {
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type rootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }
`