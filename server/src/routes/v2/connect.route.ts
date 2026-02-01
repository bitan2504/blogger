import { Router } from "express";
import verifyJWT from "../../middlewares/verifyJWT.middleware";
import { toggleFollow } from "../../controllers/v2/connect.controller";

const router = Router();

router.get("/follow/toggle/:username", verifyJWT, toggleFollow);

export default router;
