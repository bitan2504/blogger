import { Router } from "express";
import verifyJWT from "../verifyJWT.js";
import Post from "../models/post.model.js";
import ApiResponse from "../ApiResponse.js";
import { User } from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import { unknownErrorResponse } from "./index.route.js";

const shareRoute = Router();

shareRoute.get("/post/:postId", verifyJWT, async (req, res) => {
  try {
    const postId = req.params?.postId;
    const user = req.user;

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found", {}, false));
    }

    const author = await User.findById(findPost.author);
    const followed =
      user &&
      author._id &&
      user.following.some((e) => String(e) === String(author._id)) &&
      author.followers.some((e) => String(e) === String(user._id));
    const isLiked = findPost.likes.some((e) => String(e) === String(user._id));

    // const commentsId = findPost.comments;
    // const comments = (
    //   await Promise.all(
    //     commentsId.map(async (commentId) => {
    //       const comment = await Comment.findById(commentId);
    //       comment.author = await User.findById(comment.author);
    //       return comment;
    //     })
    //   )
    // ).reverse();

    const post = {
      title: findPost.title,
      content: findPost.content,
      likes: findPost.likes,
      likesCount: findPost.likes.length || 0,
      isLiked: isLiked,
      // comments: comments,
      author: {
        id: author._id || "",
        username: author.username || "Anonymous User",
        followers: author.followers || [],
        following: author.following || [],
        followed: followed || false,
      },
    };

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully fetched post", post, true));
  } catch (error) {
    console.error(error);
  }
});

shareRoute.get("/comments/:postId", async (req, res) => {
  try {
    const postId = req.params?.postId;
    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found", {}, false));
    }

    const commentsId = findPost.comments;
    const comments = (
      await Promise.all(
        commentsId.map(async (commentId) => {
          const comment = await Comment.findById(commentId);
          comment.author = await User.findById(comment.author);
          return comment;
        })
      )
    ).reverse();

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully fetched post", comments, true));
  } catch (error) {
    console.error(error);
  }
});

shareRoute.post("/comments/post/:postId", verifyJWT, async (req, res) => {
  try {
    const postId = req.params?.postId;
    const findPost = await Post.findById(postId);
    const user = await User.findById(req.user?._id);
    const content = req.body.content;
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not logged in", {}, false));
    }
    if (!findPost) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found", {}, false));
    }
    if (!content) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Content field is required", {}, false));
    }

    const newComment = await Comment.create({
      content,
      author: user._id,
      post: postId,
    });
    const comment = await Comment.findById(newComment._id);
    if (!comment) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Failed creating comment", {}, false));
    }
    findPost.comments.push(comment);
    await findPost.save({ validateBeforeSave: false });
    const post = await Post.findById(findPost._id);
    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Failed creating comment", {}, false));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully fetched post", comment, true));
  } catch (error) {
    console.error(error);
  }
});

export default shareRoute;
