import { Router } from "express";
import verifyJWT from "../verifyJWT.js";
import ApiResponse from "../ApiResponse.js";
import { User } from "../models/user.model.js";
import { securedCookieParserOptions } from './index.route.js';
import Post from '../models/post.model.js';

const userRoute = Router();

userRoute.get("/getUser", verifyJWT, async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
});

userRoute.post("/register", async (req, res) => {
  try {
    let { username, fullname, email, password, avatar, dob } = req.body;
    if (!username || !fullname || !email || !password || !dob) {
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required", {}, false));
    }

    const foundUser = await User.findOne({ username, email });
    if (foundUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, "User already exists", {}, false));
    }

    if (!avatar) {
      avatar = process.env.DEFAULT_AVATAR;
    }
    const newUser = await User.create({
      username,
      fullname,
      email,
      password,
      dob,
      avatar,
    });
    const user = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Failed to register", {}, false))
        .send("Something wern wrong!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User registered successfully", user, true));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiResponse(400, "Failed to register", error, false));
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    let { uid, password } = req.body;
    if (!uid || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, "All fields are required", {}, false));
    }

    const foundUser = await User.findOne({
      $or: [{ username: uid }, { email: uid }],
    });

    if (!foundUser || !(await foundUser.isValidPassword(password))) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "User doesn't exist! Please try Again",
            {},
            false
          )
        );
    }
    const refreshToken = await foundUser.generateRefreshToken();
    const accessToken = await foundUser.generateAccessToken();
    foundUser.refreshToken = refreshToken;
    await foundUser.save({ validateBeforeSave: false });
    const user = await User.findById(foundUser._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, securedCookieParserOptions)
      .cookie("refreshToken", refreshToken, securedCookieParserOptions)
      .json(new ApiResponse(200, "Successfully Logged in", user, true));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiResponse(400, "Something went wrong", error, false));
  }
});

userRoute.get("/logout", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "Invalid Credentials", "Unauthorized", false)
        )
        .send("Invalid Credentials");
    }
    return res
      .status(200)
      .clearCookie("accessToken", securedCookieParserOptions)
      .clearCookie("refreshToken", securedCookieParserOptions)
      .json(new ApiResponse(200, "Successfully Logged out", {}, true));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiResponse(400, "Something went wrong", error, false));
  }
});

userRoute.post("/post/create", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: user._id,
    });
    const createdPost = await Post.findById(newPost._id);

    if (!createdPost) {
      return res
        .status(402)
        .json(new ApiResponse(402, "Failed creating post", {}, false))
        .send("Something went wrong!");
    }

    const updatedUser = await User.findById(user._id);
    updatedUser.posts = updatedUser.posts.push(createdPost._id);
    await updatedUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Post created successfully", createdPost, true)
      );
  } catch (error) {
    console.error(error);
  }
});

userRoute.get("/post/show", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    const postIds = user.posts;
    const posts = [];
    for (const postId of postIds.reverse()) {
      posts.push(await Post.findById(postId));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully posted", posts, true));
  } catch (error) {
    console.error(error);
  }
});

export default userRoute;
