import upload from "../middlewares/multer.middleware";
import User from "../models/user.model";
import apiResponse from "../utils/apiResponse";
import sendMail from "../utils/nodemailer";
import { totp, authenticator } from "otplib";
import registerUserOtpTemplate from "../templates/email/registerUserOtp";
import {
  setCache,
  getCache,
  setCacheWithExpiry,
  deleteCache,
} from "../utils/redis";
import uploadOnCloud from "../utils/cloudinary";
import fs from "fs";

totp.options = {
  step: 600,
  digits: 6,
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const unlinkProfileImage = (profileImage: string) => {
  if (profileImage) {
    try {
      fs.unlinkSync(profileImage);
      console.log(`Deleted profile image: ${profileImage}`);
    } catch (error) {
      console.error(`Error deleting profile image ${profileImage}:`, error);
    }
  }
};

export const signup = async (req: any, res: any) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    unlinkProfileImage(req.file?.path || "");
    return res.status(400).json(apiResponse(false, "All fields are required"));
  }

  try {
    if (await User.findOne({ email })) {
      unlinkProfileImage(req.file?.path || "");
      return res
        .status(400)
        .json(
          apiResponse(false, "User with same email address already exists")
        );
    }

    const profileImage = req.file ? req.file.path : "";
    const secret = authenticator.generateSecret();
    const otp = totp.generate(secret);
    const emailTemplate = registerUserOtpTemplate(name, otp);
    await sendMail(email, emailTemplate.subject, emailTemplate.html);
    await setCacheWithExpiry(
      email,
      { name, email, password, profileImage, otp, secret },
      600
    );

    return res
      .status(200)
      .json(apiResponse(true, "OTP is successfully generated"));
  } catch (error) {
    unlinkProfileImage(req.file?.path || "");
    console.log(`Error signing user:`, error);
    return res
      .status(500)
      .json(apiResponse(false, "Internal Server Error", {}, String(error)));
  }
};

export const verifyOtp = async (req: any, res: any) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json(apiResponse(false, "All fields are required"));
  }

  try {
    const userData = await getCache(email);
    console.log(`Received OTP for email: ${email}`, userData);
    if (!userData) {
      return res.status(400).json(apiResponse(false, "Invalid OTP or email"));
    }

    console.log(`Verifying OTP for email: ${email}`, userData);

    if (totp.check(otp, userData.secret) === false) {
      unlinkProfileImage(userData.profileImage);
      return res.status(400).json(apiResponse(false, "Invalid OTP"));
    }

    const profileImageInstance = await uploadOnCloud(userData.profileImage);

    const newUser = new User({
      name: userData.name,
      email,
      password: userData.password,
      profileImage: profileImageInstance?.url,
      secret: userData.secret,
    });

    await newUser.save();
    deleteCache(email);

    return res
      .status(200)
      .json(apiResponse(true, "User registered successfully"));
  } catch (error) {
    console.log(`Error verifying OTP:`, error);
    return res
      .status(500)
      .json(apiResponse(false, "Internal Server Error", {}, String(error)));
  }
};

export const signin = async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(apiResponse(false, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(apiResponse(false, "User not found"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(apiResponse(true, "User signed in successfully"));
  } catch (error) {
    console.log(`Error signing in user:`, error);
    return res
      .status(500)
      .json(apiResponse(false, "Internal Server Error", {}, String(error)));
  }
};
