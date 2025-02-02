import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import homeRoute from "./routes/home.route.js";
import connectRoute from "./routes/connect.route.js";
import shareRoute from "./routes/share.route.js";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: eval(process.env.CORS_METHODS),
    headers: process.env.CORS_HEADERS,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", eval(process.env.CORS_METHODS));
  res.setHeader("Access-Control-Allow-Headers", process.env.CORS_HEADERS);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// routes
app.use("/home", homeRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/connect", connectRoute);
app.use("/share", shareRoute);

export { app };
