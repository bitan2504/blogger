import prisma from "../db/prisma.db.js";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT from cookies
 * @param req Express request object
 * @param res Express response object
 * @param next Next function callback
 */
const verifyJWT = async (req: any, res: any, next: any) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        // Verify token (handle potential errors)
        console.log("Verifying token:", token);
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET as string
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
                username: true,
                email: true,
                fullname: true,
                avatar: true,
            },
        });

        console.log("User fetched from DB:", user);
        req.user = user || null;
    } catch (error) {
        // Token might be expired or malformed
        console.error("JWT Verification Error:", error);
        req.user = null;
    }

    next();
};

export default verifyJWT;
