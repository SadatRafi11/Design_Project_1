const postsResolvers = require("./posts.resolvers");
const usersResolvers = require("./users.resolvers");
const commentsResolvers = require("./comments.resolvers");
const likesResolvers = require("./likes.resolvers");

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...likesResolvers.Mutation,
  },
};
