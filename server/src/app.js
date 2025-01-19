import express from "express";
import cors from "cors";
import { User } from "../models/user.model.js";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    methods: eval(process.env.CORS_METHODS),
    headers: process.env.CORS_HEADERS,
    credentials: true
  }
));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", eval(process.env.CORS_METHODS));
  res.setHeader("Access-Control-Allow-Headers", process.env.CORS_HEADERS);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});


// routes
app.get("/user/getUser", (req, res) => {
  // return res
  //   .status(200)
  //   .json({
  //     user: {
  //       username: "bitandas"
  //     }
  //   });
  return res.status(401);
});

app.post("/user/register", async (req, res) => {
  try {
    let {username, fullname, email, password, avatar, dob} = req.body;
    if (!username || !fullname || !email || !password || !dob) {
      return res.status(400).json(
        {
          message: "All fields are required"
        }
      );
    }

    const foundUser = await User.findOne({ username, email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!avatar) {
      avatar = process.env.DEFAULT_AVATAR;
    }
    const newUser = await User.create({ username, fullname, email, password, dob, avatar });
    const user = await User.findById(newUser._id).select("-password -refreshToken");

    if (!user) {
      return res.status(400).json({
        message: "Cannot create user"
      });
    }

    return res.status(200).json({
      data: user,
      message: "Successfully registered"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Something went wrong"
    });
  }
});

export { app };