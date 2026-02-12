import prisma from "../db/prisma.db.js";
import jwt from "jsonwebtoken";
import { Request, UserResponse } from "../interfaces.js";
import express from "express";

export interface AuthRequest extends Request {
    user?: UserResponse | null;
}

/**
 * Middleware to verify JWT from cookies
 * @param req Express request object
 * @param res Express response object
 * @param next Next function callback
 */
const verifyJWT = async (
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    const token: string = req.cookies?.accessToken;
    const JWT_ACCESS_TOKEN_SECRET: string | undefined =
        process.env.JWT_ACCESS_TOKEN_SECRET;

    if (!token) {
        // No token provided, user is not authenticated
        console.log("No JWT token found in cookies.");
        req.user = null;
        next();
        return;
    }

    try {
        // Verify token (handle potential errors)
        console.log("Verifying token:", token);
        const decoded = jwt.verify(
            token,
            JWT_ACCESS_TOKEN_SECRET as string
        ) as { id: string; username: string; email: string };

        console.log("Decoded JWT payload:", decoded.id);
        // Fetch user (Explicit select)
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email,
            },
            select: {
                id: true,
                email: true,
                fullname: true,
                avatar: true,
                dob: true,
            },
        });

        console.log("User fetched from DB:", user);
        req.user = user ? (user as UserResponse) : null;
    } catch (error) {
        // Token might be expired or malformed
        console.error("JWT Verification Error:", error);
        req.user = null;
    }

    next();
};

export default verifyJWT;
