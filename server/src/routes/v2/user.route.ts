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
    updateProfile,
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
router.patch(
    "/profile/update",
    authMiddleware as RequestHandler,
    upload.single("avatar"),
    updateProfile
);

router.post("/post/create", authMiddleware as RequestHandler, createPost);
router.get(
    "/post/show/:page",
    authMiddleware as RequestHandler,
    showPostsByPageNumber
);
router.get(
    "/profile/posts/:page",
    authMiddleware as RequestHandler,
    profilePagePosts
);

router.get("/:username", verifyJWT as RequestHandler, publicProfile);
router.get("/search", verifyJWT as RequestHandler, searchUsers);

export default router;
