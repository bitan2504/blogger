import upload from "../middlewares/multer.middleware";
import { signin, signup, verifyOtp } from "../controllers/user.controller";
import { Router } from "express";

const app = Router();

app.post("/signup", upload.single("profileImage"), signup);
app.post("/verify-otp", verifyOtp);
app.post("/signin", signin);

export default app;