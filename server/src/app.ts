import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

// Environment variables
const nodeEnv = process.env.NODE_ENV || "development";

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
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: (process.env.CORS_METHODS || "GET,POST,PUT,DELETE").split(","),
    allowedHeaders: (
        process.env.CORS_HEADERS || "Content-Type,Authorization"
    ).split(","),
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
    res.status(200).json(new ApiResponse(200, "OK", null, true));
});

// routes v2
import userRoutesV2 from "./routes/v2/user.route.js";
import connectRoutesV2 from "./routes/v2/connect.route.js";
import postRoutesV2 from "./routes/v2/post.route.js";

app.use("/api/v2/user", userRoutesV2);
app.use("/api/v2/connect", connectRoutesV2);
app.use("/api/v2/post", postRoutesV2);

// 404 handler
app.use((req, res) => {
    res.status(404).json(new ApiResponse(404, "Not Found", null, false));
});

// Error handler middleware
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Error:", err);
        res.status(err.status || 500).json(
            new ApiResponse(
                err.status || 500,
                err.message || "Internal Server Error",
                null,
                false
            )
        );
    }
);

export default app;