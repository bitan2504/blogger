import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
import { getPosts, toggleLike } from "../../controllers/v2/post.controller";

const router = Router();

router.get("/", verifyJWT, getPosts);
router.post("/like/toggle/:postId", verifyJWT, toggleLike);

export default router;
