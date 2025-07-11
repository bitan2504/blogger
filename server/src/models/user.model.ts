import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  blogs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    blogs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
