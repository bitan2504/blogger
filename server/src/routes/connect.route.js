import { Router } from "express";
import { User } from "../models/user.model.js";
import ApiResponse from "../ApiResponse.js";
import Post from "../models/post.model.js";
import verifyJWT from "../verifyJWT.js";

const connectRoute = Router();

connectRoute.get("/:username", verifyJWT, async (req, res) => {
  try {
    const username = req.params?.username;
    const searchUser = await User.findOne({ username });
    const user = await User.findById(req.user?._id);
    if (!searchUser) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not found", {}, false));
    }

    const followed =
      (user
        ? user.following.some((elem) => String(elem) === String(searchUser._id))
        : false) &&
      searchUser.followers.some(
        (follower) => String(follower) === String(user?._id)
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "User found",
        {
          _id: searchUser._id,
          username: searchUser.username,
          followers: searchUser.followers,
          following: searchUser.following,
          followed: followed,
        },
        true
      )
    );
  } catch (error) {
    console.error(error);
  }
});

connectRoute.get("/:username/posts/:page", async (req, res) => {
  try {
    const page = req.params?.page;
    const username = req.params?.username;
    const user = await User.findOne({ username });
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
      .json(new ApiResponse(200, "User found", posts, true));
  } catch (error) {
    console.error(error);
  }
});

connectRoute.get("/follow/toggle/:username", verifyJWT, async (req, res) => {
  try {
    const username = req.params?.username;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).send("User not logged in");
    }
    const searchUser = await User.findOne({ username });
    if (!searchUser) {
      return res.status(404).send("User not found");
    }

    const followed =
      searchUser.followers.some(
        (follower) => String(follower) === String(user._id)
      ) &&
      user.following.some((elem) => String(elem) === String(searchUser._id));
    if (followed) {
      searchUser.followers = searchUser.followers.filter(
        (follower) => String(follower) !== String(user._id)
      );
      user.following = user.following.filter(
        (elem) => String(elem) !== String(searchUser._id)
      );
    } else {
      user.following.push(searchUser._id);
      searchUser.followers.push(user._id);
    }

    await user.save({ validateBeforeSave: false });
    await searchUser.save({ validateBeforeSave: false });
    const createdUser = await User.findById(user._id);
    const createdSearchUser = await User.findById(searchUser._id);
    if (!createdSearchUser || !createdUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Some error occurred", {}, false));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Following toggled", { followed: !followed }, true)
      );
  } catch (error) {
    console.error(error);
  }
});

export default connectRoute;
