import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
import { toggleLike } from "../../controllers/v2/post.controller";

const router = Router();

router.get("/like/toggle/:postId", verifyJWT, toggleLike);

export default router;
