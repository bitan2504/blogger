import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

const app = express();

// Environment variables
const nodeEnv = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;

// Trust proxy for production
if (nodeEnv === "production") {
    app.set("trust proxy", 1);
}

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: (process.env.CORS_METHODS || "GET,POST,PUT,DELETE").split(","),
    allowedHeaders: (process.env.CORS_HEADERS || "Content-Type,Authorization").split(","),
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Request logging middleware (development only)
if (nodeEnv === "development") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        env: nodeEnv 
    });
});

// routes v2
import userRoutesV2 from "./routes/v2/user.route";
import connectRoutesV2 from "./routes/v2/connect.route";
import postRoutesV2 from "./routes/v2/post.route";

app.use("/api/v2/user", userRoutesV2);
app.use("/api/v2/connect", connectRoutesV2);
app.use("/api/v2/post", postRoutesV2);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        status: 404, 
        message: "Route not found" 
    });
});

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: nodeEnv === "production" ? "Internal Server Error" : err.message,
    });
});

app.listen(port, () => {
    console.log(`[${nodeEnv.toUpperCase()}] Server is running on port ${port}`);
    if (nodeEnv === "development") {
        console.log(`CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`);
    }
});
