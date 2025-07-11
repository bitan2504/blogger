import mongoose from "mongoose";

interface IComment extends mongoose.Document {
  _id: string;
  content: string;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  modifiedAt: Date;
};

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
