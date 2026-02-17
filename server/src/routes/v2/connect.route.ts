import { RequestHandler, Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import {
    getPostByUsername,
    toggleFollow,
} from "../../controllers/v2/connect.controller.js";

const router = Router();

router.get(
    "/:username/posts/:page",
    verifyJWT as RequestHandler,
    getPostByUsername
);
router.get(
    "/follow/toggle/:username",
    verifyJWT as RequestHandler,
    toggleFollow
);

export default router;
