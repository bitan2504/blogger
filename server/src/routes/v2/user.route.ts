import { RequestHandler, Router } from "express";
import {
    createPost,
    loginUser,
    logoutUser,
    profilePagePosts,
    publicProfile,
    refreshToken,
    registerUser,
    searchUsers,
    showPostsByPageNumber,
    userProfile,
} from "../../controllers/v2/user.controller.js";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import { upload } from "../../middlewares/multerFileUpload.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
const router = Router();

router.get("/refresh-token", refreshToken);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware as RequestHandler, logoutUser);
router.get("/profile", authMiddleware as RequestHandler, userProfile);

router.get("/search", verifyJWT, searchUsers);
router.post("/post/create", verifyJWT, createPost);
router.get("/post/show/:page", verifyJWT, showPostsByPageNumber);
router.get("/profile/posts/:page", verifyJWT, profilePagePosts);
router.get("/:username", verifyJWT, publicProfile);

export default router;
