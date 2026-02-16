import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserModel } from "../generated/prisma/models";

export interface AccessTokenPayload {
    id: string;
    username: string;
    email: string;
    fullname: string;
    avatar: string | null;
    dob: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Generate JWT access token
 * @param params Payload parameters for the token
 * @returns Signed JWT access token
 */
export const generateAccessToken = (user: UserModel) => {
    const secret: string = process.env.JWT_ACCESS_TOKEN_SECRET || "";
    const options: SignOptions = {
        expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRY ||
            "15m") as SignOptions["expiresIn"],
    };

    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            avatar: user.avatar,
            dob: user.dob,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } as AccessTokenPayload,
        secret,
        options
    );
};

/**
 * Verify JWT access token
 * @param token JWT access token to verify
 * @returns Decoded token payload if valid, otherwise null
 */
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
    const secret: string = process.env.JWT_ACCESS_TOKEN_SECRET || "";

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, secret) as AccessTokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export interface RefreshTokenPayload {
    id: string;
}
/**
 * Generates Refresh Token
 * @param params Payload parameters for the token
 * @returns Signed JWT Refresh Token
 */
export const generateRefreshToken = (user: UserModel) => {
    const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET || "";
    const options: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRY ||
            "7d") as SignOptions["expiresIn"],
    };

    return jwt.sign(
        {
            id: user.id,
        } as RefreshTokenPayload,
        secret,
        options
    );
};

/**
 * Verify JWT refresh token
 * @param token JWT refresh token to verify
 * @returns Decoded token payload if valid, otherwise null
 */
export const verifyRefreshToken = (
    token: string
): RefreshTokenPayload | null => {
    const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET || "";

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, secret) as RefreshTokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
