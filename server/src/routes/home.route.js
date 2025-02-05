import { Router } from "express";
import ApiResponse from "../ApiResponse.js";
import Post from "../models/post.model.js";
import verifyJWT from "../verifyJWT.js";
import { User } from "../models/user.model.js";
import { unknownErrorResponse } from "./index.route.js";
import * as sea from "node:sea";
import { parse } from "dotenv";

const homeRoute = Router();

homeRoute.get("/top/:page", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.params?.page) || 1;
    const pageSize = parseInt(process.env.PAGE_SIZE) || 5;

    const findPosts = await Post.aggregate([
      { $addFields: { likesCount: { $size: "$likes" } } },
      { $sort: { likesCount: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);

    const authorIds = [...new Set(findPosts.map((post) => post.author))];
    const authors = await User.find({ _id: { $in: authorIds } });
    const authorMap = new Map(
      authors.map((author) => [String(author._id), author])
    );

    const posts = findPosts.map((post) => {
      const searchUser = authorMap.get(String(post.author)) || {};
      const followed =
        user &&
        searchUser._id &&
        user.following.some((e) => String(e) === String(searchUser._id)) &&
        searchUser.followers.some((e) => String(e) === String(user._id));
      const isLiked = post.likes.some((e) => String(e) === String(user?._id));

      return {
        ...post,
        likesCount: post.likes.length || 0,
        isLiked,
        author: {
          _id: searchUser._id || "",
          username: searchUser.username || "Anonymous User",
          followers: searchUser.followers || [],
          following: searchUser.following || [],
          followed: followed || false,
        },
      };
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched successfully", posts, true));
  } catch (error) {
    console.log(error);
    return unknownErrorResponse(res);
  }
});

homeRoute.get("/:page", verifyJWT, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.params?.page) || 1;
    const pageSize = parseInt(process.env.PAGE_SIZE) || 5;

    const findPosts = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);

    const authorIds = [...new Set(findPosts.map((post) => post.author))];
    const authors = await User.find({ _id: { $in: authorIds } });
    const authorMap = new Map(
      authors.map((author) => [String(author._id), author])
    );

    const posts = findPosts.map((post) => {
      const searchUser = authorMap.get(String(post.author)) || {};
      const followed =
        user &&
        searchUser._id &&
        user.following.some((e) => String(e) === String(searchUser._id)) &&
        searchUser.followers.some((e) => String(e) === String(user?._id));
      const isLiked = post.likes.some((e) => String(e) === String(user?._id));

      return {
        ...post,
        likesCount: post.likes.length || 0,
        isLiked,
        author: {
          _id: searchUser._id || "",
          username: searchUser.username || "Anonymous User",
          followers: searchUser.followers || [],
          following: searchUser.following || [],
          followed: followed || false,
        },
      };
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched successfully", posts, true));
  } catch (error) {
    console.error(error);
    return unknownErrorResponse(res);
  }
});

export default homeRoute;
