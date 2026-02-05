import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import {
    commentOnPost,
    getPostById,
    getPosts,
    toggleLike,
} from "../../controllers/v2/post.controller.js";

const router = Router();

router.get("/", verifyJWT, getPosts);
router.get("/:postId", verifyJWT, getPostById);
router.post("/comment/create/:postId", verifyJWT, commentOnPost);
router.post("/like/toggle/:postId", verifyJWT, toggleLike);

export default router;
