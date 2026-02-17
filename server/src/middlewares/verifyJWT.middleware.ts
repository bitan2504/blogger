import { Response, NextFunction } from "express";
import { AccessTokenPayload, verifyAccessToken } from "../utils/AuthToken.js";
import { AuthRequest } from "./auth.middleware.js";

/**
 * Middleware to verify JWT from cookies
 * @param req Express request object
 * @param res Express response object
 * @param next Next function callback
 */
const verifyJWT = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token: string | undefined =
        req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    let user: AccessTokenPayload | null = null;

    try {
        user = verifyAccessToken(token || "");
    } catch (error) {
        user = null;
    }

    req.user = user || null;
    next();
};

export default verifyJWT;
