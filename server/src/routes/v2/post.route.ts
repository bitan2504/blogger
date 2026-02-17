import { RequestHandler, Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import {
    commentOnPost,
    getPostById,
    getPosts,
    toggleLike,
} from "../../controllers/v2/post.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT as RequestHandler, getPosts);
router.get("/:postId", verifyJWT as RequestHandler, getPostById);
router.post(
    "/comment/create/:postId",
    authMiddleware as RequestHandler,
    commentOnPost
);
router.post(
    "/like/toggle/:postId",
    authMiddleware as RequestHandler,
    toggleLike
);

export default router;
