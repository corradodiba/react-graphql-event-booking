const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const auth = require('./middleware/auth');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', auth, graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
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