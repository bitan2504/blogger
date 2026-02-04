import jwt from "jsonwebtoken";
/**
 * Generate JWT access token
 * @param params Payload parameters for the token
 * @returns Signed JWT access token
 */
export const generateAccessToken = (params) => {
    const secret = process.env.JWT_ACCESS_TOKEN_SECRET || "fallback_secret";
    const options = {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY ||
            "1d",
    };
    return jwt.sign(params, secret, options);
};
/**
 * Generates Refresh Token
 * @param params Payload parameters for the token
 * @returns Signed JWT Refresh Token
 */
export const generateRefreshToken = (params) => {
    const secret = process.env.JWT_REFRESH_TOKEN_SECRET || "fallback_secret";
    const options = {
        expiresIn: process.env
            .JWT_REFRESH_TOKEN_EXPIRY || "10d",
    };
    return jwt.sign(params, secret, options);
};
