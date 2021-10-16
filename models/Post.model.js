const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  postBody: String,
  email: String,
  username: String,
  createdAt: String,
  likes: [
    {
      email: String,
      username: String,
      createdAt: String,
    },
  ],
  comments: [
    {
      commentBody: String,
      email: String,
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
