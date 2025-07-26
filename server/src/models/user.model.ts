import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  blogs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
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
      index: true,
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

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"));
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET || "default_secret",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    } as jwt.SignOptions
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET || "default_secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    } as jwt.SignOptions
  );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
