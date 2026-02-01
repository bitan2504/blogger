import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: process.env.CORS_METHODS,
        allowedHeaders: process.env.CORS_HEADERS,
        credentials: true,
    })
);

console.log("CORS ORIGIN:", process.env.CORS_ORIGIN);
console.log("CORS METHODS:", process.env.CORS_METHODS);
console.log("CORS HEADERS:", process.env.CORS_HEADERS);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "");
    res.setHeader(
        "Access-Control-Allow-Methods",
        process.env.CORS_METHODS || ""
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        process.env.CORS_HEADERS || ""
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// routes v2
import userRoutesV2 from "./routes/v2/user.route.ts";
app.use("/api/v2/user", userRoutesV2);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
