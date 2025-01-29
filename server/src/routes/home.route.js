import { Router } from "express";
import ApiResponse from "../ApiResponse.js";
import Post from "../models/post.model.js";

const homeRoute = Router();

homeRoute.get("/:page", async (req, res) => {
  const page = parseInt(req.params?.page) || 1;
  try {
    const posts = await Post.find({});
    const totalPosts = posts.length;
    if (totalPosts < (page - 1) * parseInt(process.env.PAGE_SIZE)) {
      return res.status(404).send("Page Not Found");
    }

    const ret = posts
      .slice(
        (page - 1) * parseInt(process.env.PAGE_SIZE),
        Math.max(page * parseInt(process.env.PAGE_SIZE) - 1, totalPosts - 1)
      )
      .reverse();

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched successfully", ret, true));
  } catch (error) {
    console.error(error);
  }
});

export default homeRoute;
