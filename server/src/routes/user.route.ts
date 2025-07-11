import upload from "@/middlewares/multer";
import User from "@/models/user.model";
import apiResponse from "@/utils/apiResponse";
import sendMail from "@/utils/nodemailer";
import { Router } from "express";
import { totp, authenticator } from "otplib";

const app = Router();

const otpMap = new Map<
  string,
  {
    name: string;
    profileImage: string;
    password: string;
    otp: string;
    secret: string;
  }
>();

totp.options = {
  step: 600,
  digits: 6,
};

app.post("/signin", upload.single("profileImage"), async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(apiResponse(false, "All feilds are required"));
  }

  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json(
          apiResponse(false, "User with same email address already exists")
        );
    }

    const profileImage = req.file ? req.file.path : "";
    const secret = authenticator.generateSecret();
    const otp = totp.generate(secret);
    otpMap.set(email, { name, password, profileImage, otp, secret });
    const emailTemplate = registerUserOtpTemplate(name, otp);
    await sendMail(email, emailTemplate.subject, emailTemplate.html);

    return res
      .status(200)
      .json(apiResponse(true, "OTP is successfully generated"));
  } catch (error) {
    console.log(`Error signing user:`, error);
    return res
      .status(500)
      .json(apiResponse(false, "Internal Server Error", {}, String(error)));
  }
});

export default app;