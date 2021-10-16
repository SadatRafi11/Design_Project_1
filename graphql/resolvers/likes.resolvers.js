const { UserInputError } = require("apollo-server");

const Post = require("../../models/Post.model");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async likePost(_, { postId }, context) {
      const { email, username } = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (post) {
          if (post.likes.find((like) => like.email === email)) {
            post.likes = post.likes.filter((like) => like.email !== email);
          } else {
            post.likes.push({
              email,
              username,
              createdAt: new Date().toISOString(),
            });
          }

          await post.save();
          return post;
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
