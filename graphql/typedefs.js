require("apollo-server");
const gql = require("graphql-tag");
require("graphql");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
  input RegisterInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
  }
`;
