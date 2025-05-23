import { Router } from "express";
import verifyJWT from "../verifyJWT.js";
import ApiResponse from "../ApiResponse.js";
import { User } from "../models/user.model.js";
import { securedCookieParserOptions } from "./index.route.js";
import Post from "../models/post.model.js";

const userRoute = Router();

userRoute.get("/getUser", verifyJWT, async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched successfully", user, true));
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

userRoute.get("/post/show/:page", verifyJWT, async (req, res) => {
  const page = parseInt(req.params?.page) || 1;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const fetchedPostIds = user.posts;

    const totalPosts = fetchedPostIds.length;
    const postIds = fetchedPostIds
      .slice(
        (page - 1) * parseInt(process.env.PAGE_SIZE),
        Math.max(page * parseInt(process.env.PAGE_SIZE) - 1, totalPosts - 1)
      )
      .reverse();

    const posts = await Promise.all(
      postIds.map(async (postId) => await Post.findById(postId)).reverse()
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully posted", posts, true));
  } catch (error) {
    console.error(error);
  }
});

userRoute.get("/profile", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not found", {}, false));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "User found",
        {
          _id: user._id,
          username: user.username,
          followers: user.followers,
          following: user.following,
        },
        true
      )
    );
  } catch (error) {
    console.error(error);
  }
});

userRoute.get("/profile/posts/:page", verifyJWT, async (req, res) => {
  try {
    const page = req.params?.page;
    const user = await User.findById(req.user?._id);
    const pageSize = parseInt(process.env.PAGE_SIZE) || 5;
    if (!user) {
      return res.status(400).send("User not found");
    }

    const postIds = user.posts;
    const findPosts = await Post.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const posts = findPosts.map((post) => ({
      ...post,
      likesCount: post.likes.length || 0,
      isLiked: post.likes.some((e) => String(e) === String(user._id)),
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, "User found", posts, true));
  } catch (error) {
    console.error(error);
  }
});

export default userRoute;
