import jwt, { Secret, SignOptions } from "jsonwebtoken";

/**
 * Generate JWT access token
 * @param params Payload parameters for the token
 * @returns Signed JWT access token
 */
export const generateAccessToken = (params: any) => {
    const secret =
        (process.env.JWT_ACCESS_TOKEN_SECRET as Secret) || "fallback_secret";
    const options: SignOptions = {
        expiresIn:
            (process.env.JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"]) ||
            "1d",
    };

    return jwt.sign(params, secret, options);
};

/**
 * Generates Refresh Token
 * @param params Payload parameters for the token
 * @returns Signed JWT Refresh Token
 */
export const generateRefreshToken = (params: any) => {
    const secret =
        (process.env.JWT_REFRESH_TOKEN_SECRET as Secret) || "fallback_secret";
    const options: SignOptions = {
        expiresIn:
            (process.env
                .JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"]) || "10d",
    };

    return jwt.sign(params, secret, options);
};
