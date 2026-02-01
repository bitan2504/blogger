import { Router } from "express";
import {
    createPost,
    getUser,
    loginUser,
    logoutUser,
    profilePagePosts,
    registerUser,
    showPostsByPageNumber,
    userProfile,
} from "../../controllers/v2/user.controller";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
const router = Router();

router.get("/getUser", verifyJWT, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);
router.post("/post/create", verifyJWT, createPost);
router.get("/post/show/:page", verifyJWT, showPostsByPageNumber);
router.get("/profile", verifyJWT, userProfile);
router.get("/profile/posts/:page", verifyJWT, profilePagePosts);

export default router;
