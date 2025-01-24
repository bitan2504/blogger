import express from "express";
import cors from "cors";
import { User } from "./models/user.model.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import ApiResponse from "./ApiResponse.js";
import Post from "./models/post.model.js";
import { parse } from "dotenv";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    methods: eval(process.env.CORS_METHODS),
    headers: process.env.CORS_HEADERS,
    credentials: true
  }
));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", eval(process.env.CORS_METHODS));
  res.setHeader("Access-Control-Allow-Headers", process.env.CORS_HEADERS);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});


// routes
const securedCookieParserOptions = {
  secure: true,
  httpOnly: true
};

// middlewares
const verifyJWT = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(
        401,
        "Unauthorized Access",
        "Unauthorized",
        false
      ))
      .send("Unauthorized Access");
  }

  const authToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  const user = await User.findById(authToken?._id)
    .select("-password -refresh");
  req.user = user;
  next();
};

// functions
const getUser = async (req) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return null;
  }
  const authToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  const user = await User.findById(authToken?._id)
    .select("-password -refreshToken");

  return user;
};

// user routes and controllers
app.get("/user/getUser", async (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(201).json(null);
  }
  const authToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  const user = await User.findById(authToken?._id)
    .select("-password -refreshToken");

  return res.status(200).json(user);
});

app.post("/user/register", async (req, res) => {
  try {
    let { username, fullname, email, password, avatar, dob } = req.body;
    if (!username || !fullname || !email || !password || !dob) {
      return res
        .status(400)
        .json(new ApiResponse(
          400,
          "All fields are required",
          {},
          false
        ));
    }

    const foundUser = await User.findOne({ username, email });
    if (foundUser) {
      return res
        .status(400)
        .json(new ApiResponse(
          400,
          "User already exists",
          {},
          false
        ));
    }

    if (!avatar) {
      avatar = process.env.DEFAULT_AVATAR;
    }
    const newUser = await User.create({ username, fullname, email, password, dob, avatar });
    const user = await User.findById(newUser._id).select("-password -refreshToken");

    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(
          400,
          "Failed to register",
          {},
          false
        ))
        .send("Something wern wrong!");
    }

    return res
      .status(200)
      .json(new ApiResponse(
        200,
        "User registered successfully",
        user,
        true
      ));
  } catch (error) {
    console.error(error);
    return res.status(400).json(new ApiResponse(
      400,
      "Failed to register",
      error,
      false
    ));
  }
});

app.post("/user/login", async (req, res) => {
  try {
    let { uid, password } = req.body;
    if (!uid || !password) {
      return res
        .status(400)
        .json(new ApiResponse(
          400,
          "All fields are required",
          {},
          false
        ));
    }

    const foundUser = await User.findOne(
      {
        $or: [{ username: uid }, { email: uid }]
      });

    if (!foundUser || !(await foundUser.isValidPassword(password))) {
      return res
        .status(400)
        .json(new ApiResponse(
          400,
          "User doesn't exist! Please try Again",
          {},
          false
        ));
    }
    const refreshToken = await foundUser.generateRefreshToken();
    const accessToken = await foundUser.generateAccessToken();
    foundUser.refreshToken = refreshToken;
    await foundUser.save({ validateBeforeSave: false });
    const user = await User.findById(foundUser._id)
      .select("-password -refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, securedCookieParserOptions)
      .cookie("refreshToken", refreshToken, securedCookieParserOptions)
      .json(new ApiResponse(
        200,
        "Successfully Logged in",
        user,
        true
      ));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiResponse(
        400,
        "Something went wrong",
        error,
        false
      ));
  }
});

app.get("/user/logout", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(
          401,
          "Invalid Credentials",
          "Unauthorized",
          false
        ))
        .send("Invalid Credentials");
    }
    return res
      .status(200)
      .clearCookie("accessToken", securedCookieParserOptions)
      .clearCookie("refreshToken", securedCookieParserOptions)
      .json(new ApiResponse(
        200,
        "Successfully Logged out",
        {},
        true
      ));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiResponse(
        400,
        "Something went wrong",
        error,
        false
      ));
  }
});


// user post routes and controllers
app.post("/user/post/create", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    const { title, content } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: user._id
    });
    const createdPost = await Post.findById(newPost._id);

    if (!createdPost) {
      return res
        .status(402)
        .json(new ApiResponse(
          402,
          "Failed creating post",
          {},
          false
        ))
        .send("Something went wrong!");
    }

    const updatedUser = await User.findById(user._id);
    updatedUser.posts = updatedUser.posts.push(createdPost._id);
    await updatedUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(
        200,
        "Post created successfully",
        createdPost,
        true
      ));
  } catch (error) {
    console.error(error);
  }
});

app.get("/user/post/show", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    const postIds = user.posts;
    const posts = [];
    for (const postId of postIds.reverse()) {
      posts.push(await Post.findById(postId));
    }

    return res
      .status(200)
      .json(new ApiResponse(
        200,
        "Successfully posted",
        posts,
        true
      ));
  } catch (error) {
    console.error(error);
  }
});

// post routes and controllers
app.get("/post/show/:postId", async (req, res) => {
  const postId = req.params?.postId;
  try {
    const user = await getUser(req);
    if (!user) {
      return res
        .status(201)
        .json(new ApiResponse(
          201,
          "User not logged in",
          {},
          true
        ));
    }

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(
          404,
          "Post not found",
          {},
          false
        ));
    }

    const isLiked = findPost.likes.some(like => parseInt(like) === parseInt(user._id));

    return res
      .status(200)
      .json(new ApiResponse(
        200,
        "Successfully fetched post",
        { isLiked },
        true
      ));
  } catch (error) {
    console.error(error);
  }
});

app.get("/post/like/toggle/:postId", verifyJWT, async (req, res) => {
    const postId = req.params?.postId;
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(201)
          .json(new ApiResponse(
            201,
            "User not logged in",
            { isLiked: true },
            true
          ));
      }

      const findPost = await Post.findById(postId);
      if (!findPost) {
        return res
          .status(404)
          .json(new ApiResponse(
            404,
            "Post not found",
            {},
            false
          ));
      }

      const isLiked = findPost.likes.some(like => parseInt(like) === parseInt(user._id));
      if (isLiked) {
        findPost.likes = findPost.likes.filter(like => parseInt(like) !== parseInt(user._id));
      } else {
        findPost.likes.push(user._id);
      }
      await findPost.save({ validateBeforeSave: false });

      const post = await Post.findById(findPost._id);
      if (!post) {
        return res
          .status(401)
          .json(new ApiResponse(
            401,
            "Something went wrong",
            {},
            false
          ));
      }

      return res
        .status(200)
        .json(new ApiResponse(
          200,
          "Post like toggled successfully",
          { isLiked: !isLiked, post },
          true
        ));
    } catch (error) {
      console.error(error);
    }
  });

export { app };