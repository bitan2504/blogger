import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
import { commentOnPost, getPostById, getPosts, toggleLike, } from "../../controllers/v2/post.controller";
const router = Router();
router.get("/", verifyJWT, getPosts);
router.get("/:postId", verifyJWT, getPostById);
router.post("/comment/create/:postId", verifyJWT, commentOnPost);
router.post("/like/toggle/:postId", verifyJWT, toggleLike);
export default router;
