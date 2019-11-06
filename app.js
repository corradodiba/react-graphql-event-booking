const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            username: String!
            email: String!
            password: String
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
        }

        type rootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find();
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
                createEvent = event
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
    },
    graphiql: true
}));

mongoose.connect("mongodb://localhost:27017/event-booking", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database")
  })
  .catch(() => {
    console.log("Connection failed")
  })
app.listen(3000);