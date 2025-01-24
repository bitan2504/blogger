import mongoose, { Schema } from "mongoose";

const likeSchema = mongoose.Schema({
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  });

const Like = mongoose.model("Like", likeSchema);
export default Like;