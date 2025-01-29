import { User } from "./models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    req.user = null;
  } else {
    const authToken = await jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    const user = await User.findById(authToken?._id).select(
      "-password -refresh"
    );
    req.user = user;
  }
  next();
};

export default verifyJWT;
