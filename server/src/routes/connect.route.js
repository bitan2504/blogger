import { Router } from "express";
import { User } from "../models/user.model.js";
import ApiResponse from "../ApiResponse.js";
import Post from "../models/post.model.js";

const connectRoute = Router();

connectRoute.get("/:username", async (req, res) => {
  try {
    const username = req.params?.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not found", {}, false));
    }
    // console.log(user);

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

export default connectRoute;
