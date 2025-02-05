import { Router } from "express";
import ApiResponse from "../ApiResponse.js";
import Post from "../models/post.model.js";
import { User } from "../models/user.model.js";
import verifyJWT from "../verifyJWT.js";

const postRoute = Router();

postRoute.get("/show/:postId", verifyJWT, async (req, res) => {
  const postId = req.params?.postId;
  try {
    const user = req.user;
    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found", {}, false));
    }

    const isLiked = findPost.likes.some(
      (like) => String(like) === String(user?._id)
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Successfully fetched post",
        {
          isLiked,
          likesCount: findPost.likes.length,
        },
        true
      )
    );
  } catch (error) {
    console.error(error);
  }
});

postRoute.get("/like/toggle/:postId", verifyJWT, async (req, res) => {
  const postId = req.params?.postId;
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(201)
        .json(new ApiResponse(201, "User not logged in", {}, false));
    }

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found", {}, false));
    }

    const isLiked = findPost.likes.some(
      (like) => String(like) === String(user._id)
    );
    if (isLiked) {
      findPost.likes = findPost.likes.filter(
        (like) => String(like) !== String(user._id)
      );
    } else {
      findPost.likes.push(user._id);
    }
    await findPost.save({ validateBeforeSave: false });

    const post = await Post.findById(findPost._id);
    if (!post) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Something went wrong", {}, false));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Post like toggled successfully",
          { isLiked: !isLiked, likesCount: findPost.likes.length },
          true
        )
      );
  } catch (error) {
    console.error(error);
  }
});

export default postRoute;
