require("apollo-server");
const gql = require("graphql-tag");
require("graphql");

module.exports = gql`
  type Comment {
    id: ID!
    commentBody: String!
    email: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    postBody: String!
    email: String!
    username: String!
    likes: [Like]!
    comments: [Comment]!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input CommentInput {
    postId: ID!
    commentBody: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(loginInput: LoginInput!): User!
    createPost(postBody: String!): Post!
    deletePost(postId: ID!): String!
    createComment(commentInput: CommentInput!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;
