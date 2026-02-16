import jwt, { Secret, SignOptions } from "jsonwebtoken";

/**
 * Generate JWT access token
 * @param params Payload parameters for the token
 * @returns Signed JWT access token
 */
export const generateAccessToken = (params: any) => {
    const secret: string = process.env.JWT_ACCESS_TOKEN_SECRET || "";
    const options: SignOptions = {
        expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRY ||
            "15m") as SignOptions["expiresIn"],
    };

    return jwt.sign(params, secret, options);
};

/**
 * Generates Refresh Token
 * @param params Payload parameters for the token
 * @returns Signed JWT Refresh Token
 */
export const generateRefreshToken = (params: any) => {
    const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET || "";
    const options: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRY ||
            "7d") as SignOptions["expiresIn"],
    };

    return jwt.sign(params, secret, options);
};
