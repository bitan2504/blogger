import { Router } from "express";
import verifyJWT from "../verifyJWT.js";
import Post from "../models/post.model.js"
import ApiResponse from "../ApiResponse.js"

const shareRoute = Router();

shareRoute.get("/post/:postId", verifyJWT, async (req, res) => {
  try {
    const postId = req.params?.postId;
    const user = req.user;

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new (404, "Post not found", {}, false));
    }

    const isLiked = findPost.likes.some(
      (like) => String(like) == String(user?._id)
    );
    const likes = findPost.likes.length;

    return res.status(200).json(
      new ApiResponse(
        200,
        "Successfully fetched post",
        {
          _id: findPost._id,
          title: findPost.title,
          content: findPost.content,
          author: findPost.author,
          isLiked,
          likes,
        },
        true
      )
    );
  } catch (error) {
    console.error(error);
  }
});

export default shareRoute;
