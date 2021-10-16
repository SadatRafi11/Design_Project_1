const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post.model");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { postBody }, context) {
      const user = checkAuth(context);

      if (postBody.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        postBody,
        user: user.id,
        email: user.email,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      try {
        const post = await newPost.save();

        context.pubsub.publish("NEW_POST", {
          newPost: post,
        });

        return post;
      } catch (err) {
        throw new Error(err);
      }
    },

    async deletePost(_, { postId }, context) {
      console.log(postId);
      const user = checkAuth(context);
      console.log(user.email);
      try {
        const post = await Post.findById(postId);
        if (post && user) {
          console.log(post.email);
          if (post.email === user.email) {
            try {
              await post.delete();
              return "The post has been deleted successfully";
            } catch (err) {
              throw new Error(err);
            }
          } else {
            throw new AuthenticationError("Invalid request!");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
