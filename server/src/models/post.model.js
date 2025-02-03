import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "Like",
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: "Comment",
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
