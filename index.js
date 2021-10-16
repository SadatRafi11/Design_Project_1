const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGOURI, PORT } = require("./config");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers/index.resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

try {
  mongoose
    .connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the Database");
      server.listen({ port: PORT }).then((res) => {
        console.log(`Server running at ${res.url}`);
      });
    });
} catch (err) {
  throw new Error(err);
}
