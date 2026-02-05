import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import {
    getPostByUsername,
    toggleFollow,
} from "../../controllers/v2/connect.controller.js";

const router = Router();

router.get("/:username/posts/:page", verifyJWT, getPostByUsername);
router.get("/follow/toggle/:username", verifyJWT, toggleFollow);

export default router;
