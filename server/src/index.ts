import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    allowedHeaders: process.env.CORS_HEADERS,
    credentials: process.env.CORS_CREDENTIALS === "true",
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// Static files
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
import userRoutes from "./routes/user.route";
app.use("/api/v2/user", userRoutes);

// Database Connection
const connectToDatabase: () => Promise<typeof mongoose | null> = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`
    );
    console.log("Database connected successfully");
    return connectionInstance;
  } catch (error) {
    console.error("Database connection failed:", error);
    return null;
  }
};

import { connectRedis } from "./utils/redis";
// Start Server
connectToDatabase().then(async (connection) => {
  if (connection) {
    await connectRedis();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } else {
    console.error("Failed to start server due to database connection error.");
    process.exit(1);
  }
});
