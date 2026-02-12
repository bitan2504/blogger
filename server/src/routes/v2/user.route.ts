import { Router } from "express";
import {
    createPost,
    deleteUser,
    getUser,
    loginUser,
    logoutUser,
    profilePagePosts,
    publicProfile,
    registerUser,
    searchUsers,
    showPostsByPageNumber,
    updateUser,
    userProfile,
    verifyEmail,
} from "../../controllers/v2/user.controller.js";
import verifyJWT from "../../middlewares/verifyJWT.middleware.js";
import { upload } from "../../middlewares/multerFileUpload.middleware.js";
import express from "express";
const router = Router();

router.get("/getUser", verifyJWT, getUser);
router.get("/search", verifyJWT, searchUsers);
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/update", verifyJWT, upload.single("avatar"), updateUser);
router.get("/logout", verifyJWT, logoutUser);
router.delete("/", verifyJWT, deleteUser);

router.post("/post/create", verifyJWT, createPost);
router.get("/post/show/:page", verifyJWT, showPostsByPageNumber);
router.get("/profile", verifyJWT, userProfile);
router.get("/profile/posts/:page", verifyJWT, profilePagePosts);
router.get("/:username", verifyJWT, publicProfile);

export default router;
