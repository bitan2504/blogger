import { Router } from "express";
import {
    createPost,
    loginUser,
    logoutUser,
    registerUser,
    showPostsByPageNumber,
} from "../../controllers/v2/user.controller";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);
router.post("/post/create", verifyJWT, createPost);
router.get("/post/show/:page", verifyJWT, showPostsByPageNumber);

export default router;
