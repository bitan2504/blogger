import mongoose from "mongoose";

interface IBlog extends mongoose.Document {
  _id: string;
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  comments: mongoose.Schema.Types.ObjectId[];
  featuredImage: string;
  likedBy: mongoose.Schema.Types.ObjectId[];
  shares: number;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
