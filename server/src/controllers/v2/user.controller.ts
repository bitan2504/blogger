import prisma from "../../db/prisma.db";
import express from "express";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/AuthToken";
import { hashPassword, comparePassword } from "../../utils/HashPassword";

/**
 * Cookie Parser Options for Secure Cookies
 */
export const securedCookieParserOptions: express.CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};

/**
 * Register a new user
 * @route POST /api/v2/user/register
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with registration status
 */
export const registerUser = async (req: any, res: any) => {
    const { username, email, fullname, password, avatar, dob } = req.body;

    /**
     * Input Validation
     */
    // Validate input types
    if (
        [username, email, fullname, password].some(
            (str) => !str || str.trim().length === 0
        ) ||
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof fullname !== "string" ||
        typeof password !== "string"
    ) {
        return res
            .status(400)
            .json({ message: "Required fields must be non-empty strings" });
    }

    // Handle Optional Avatar
    if (avatar && typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar must be a string URL" });
    }

    // Handle Date of Birth
    if (!dob || isNaN(Date.parse(dob))) {
        return res
            .status(400)
            .json({ message: "Invalid Date of Birth format" });
    }

    // Validate password length
    if (
        password.length < Number(process.env.PASSWORD_MIN_LENGTH || "6") ||
        password.length > Number(process.env.PASSWORD_MAX_LENGTH || "16")
    ) {
        return res.status(400).json({
            message: `Password must be between ${process.env.PASSWORD_MIN_LENGTH} and ${process.env.PASSWORD_MAX_LENGTH} characters`,
        });
    }

    try {
        // Check if user with the same username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }],
            },
        });

        if (existingUser) {
            // User with same username or email already exists
            return res
                .status(409)
                .json({ message: "Username or email already in use" });
        }

        // generate hashed password
        const hashedPassword = await hashPassword(password);

        const newUserData = {
            username,
            email,
            fullname,
            password: hashedPassword,
            dob: new Date(dob),
            avatar,
        };

        if (!avatar || avatar.trim() === "") {
            // Set default avatar if not provided
            newUserData.avatar = process.env.DEFAULT_AVATAR || "";
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: newUserData,
        });

        // User created successfully
        res.status(200).json({
            message: "User registered successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Login an existing user
 * @route POST /api/v2/user/login
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with login status
 */
export const loginUser = async (req: any, res: any) => {
    const { uid, password } = req.body;

    /**
     * Input Validation
     */
    // Check for missing fields
    if (
        [uid, password].some((field) => !field) ||
        typeof uid !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    try {
        // checks for user with given credentials
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ username: uid }, { email: uid }],
            },
        });

        if (!user || !(await comparePassword(password, user.password))) {
            // user with given credentials does not exists
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generate access token and refresh token
        const accessToken = generateAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        const refreshToken = generateRefreshToken({ id: user.id });

        // update the recent refresh token
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        res.status(200)
            .cookie("refreshToken", refreshToken, securedCookieParserOptions)
            .cookie("accessToken", accessToken, securedCookieParserOptions)
            .json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Logout an authenticated user
 * @route POST /api/v2/user/logout
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with logout status
 */
export const logoutUser = async (req: any, res: any) => {
    const user = req.user;

    if (!user) {
        // No authenticated user found
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Invalidate the refresh token in the database
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: null },
        });

        res.status(200)
            .clearCookie("refreshToken", securedCookieParserOptions)
            .clearCookie("accessToken", securedCookieParserOptions)
            .json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
