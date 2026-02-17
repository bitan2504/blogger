import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import { AccessTokenPayload, verifyAccessToken } from "../utils/AuthToken.js";

export interface AuthRequest extends Request {
    user?: AccessTokenPayload | null;
}

export interface AuthUser extends AccessTokenPayload {}

/**
 * Middleware to Authenticate Requests using JWT Access Tokens
 * @param req Express request object
 * @param res Express response object
 * @param next Next function callback
 */
const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token: string | undefined =
        req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    try {
        const user: AccessTokenPayload | null = verifyAccessToken(token || "");

        if (!user) {
            throw new Error("Invalid token");
        }

        req.user = user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized Access", null, false));
    }
};

export default authMiddleware;
