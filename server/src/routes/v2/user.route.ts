import { Router } from "express";
import {
    createPost,
    getUser,
    loginUser,
    logoutUser,
    profilePagePosts,
    publicProfile,
    registerUser,
    searchUsers,
    showPostsByPageNumber,
    userProfile,
} from "../../controllers/v2/user.controller.js";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import { upload } from "../../middlewares/multerFileUpload.middleware.js";
const router = Router();

router.get("/getUser", verifyJWT, getUser);
router.get("/search", verifyJWT, searchUsers);
router.post("/register", verifyJWT, upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);
router.post("/post/create", verifyJWT, createPost);
router.get("/post/show/:page", verifyJWT, showPostsByPageNumber);
router.get("/profile", verifyJWT, userProfile);
router.get("/profile/posts/:page", verifyJWT, profilePagePosts);
router.get("/:username", verifyJWT, publicProfile);

export default router;
