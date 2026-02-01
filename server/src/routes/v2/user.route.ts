import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
} from "../../controllers/v2/user.controller";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);

export default router;
