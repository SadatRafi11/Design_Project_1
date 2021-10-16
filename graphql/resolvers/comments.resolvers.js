const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post.model");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async createComment(_, { commentInput: { postId, commentBody } }, context) {
      const { email, username } = checkAuth(context);

      if (commentBody.trim() === "") {
        throw new UserInputError("Empty comment error");
      }

      try {
        const post = await Post.findById(postId);

        if (post) {
          post.comments.unshift({
            commentBody,
            email: email,
            username: username,
            createdAt: new Date().toISOString(),
          });

          await post.save();

          context.pubsub.publish("NEW_COMMENT", {
            newComment: post,
          });

          return post;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async deleteComment(_, { postId, commentId }, context) {
      const { email } = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );

          if (post.comments[commentIndex]) {
            if (post.comments[commentIndex].email === email) {
              post.comments.splice(commentIndex, 1);
              await post.save();
              return post;
            } else {
              throw new AuthenticationError("Invalid User");
            }
          } else {
            throw new UserInputError("Comment not found");
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
    newComment: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_COMMENT"),
    },
  },
};
