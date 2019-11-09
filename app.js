const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { authentication } = require('./middleware/auth');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return authentication(req);
  }
});

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
    mongoose.connect("mongodb://localhost:27017/event-booking", { useNewUrlParser: true })
  .then(() => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
  .catch(() => {
    console.log("Connection failed")
  });
});

