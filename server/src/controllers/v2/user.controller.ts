import prisma from "../../db/prisma.db";
import ApiResponse from "../../utils/ApiResponse";
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
 * Get authenticated user details
 * @route GET /api/v2/user/getUser
 * @param req Express request object
 * @param res Express response object
 */
export const getUser = async (req: any, res: any) => {
    const user = req.user;
    res.status(200).json(
        new ApiResponse(200, "User retrieved successfully", user, true)
    );
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
            .json(
                new ApiResponse(
                    400,
                    "Required fields must be non-empty strings",
                    null,
                    false
                )
            );
    }

    // Handle Optional Avatar
    if (avatar && typeof avatar !== "string") {
        return res
            .status(400)
            .json(
                new ApiResponse(400, "Avatar must be a string URL", null, false)
            );
    }

    // Handle Date of Birth
    if (!dob || isNaN(Date.parse(dob))) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    "Invalid Date of Birth format",
                    null,
                    false
                )
            );
    }

    // Validate password length
    if (
        password.length < Number(process.env.PASSWORD_MIN_LENGTH || "6") ||
        password.length > Number(process.env.PASSWORD_MAX_LENGTH || "16")
    ) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    `Password must be between ${process.env.PASSWORD_MIN_LENGTH} and ${process.env.PASSWORD_MAX_LENGTH} characters`,
                    null,
                    false
                )
            );
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
                .json(
                    new ApiResponse(
                        409,
                        "Username or email already in use",
                        null,
                        false
                    )
                );
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
            select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                avatar: true,
                dob: true,
            },
        });

        // User created successfully
        res.status(200).json(
            new ApiResponse(200, "User registered successfully", newUser, true)
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
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
        return res
            .status(400)
            .json(new ApiResponse(400, "Missing credentials", null, false));
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
            return res
                .status(401)
                .json(new ApiResponse(401, "Invalid credentials", null, false));
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
            select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                avatar: true,
                dob: true,
            },
        });

        res.status(200)
            .cookie("refreshToken", refreshToken, securedCookieParserOptions)
            .cookie("accessToken", accessToken, securedCookieParserOptions)
            .json(new ApiResponse(200, "Login successful", null, true));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
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
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
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
            .json(new ApiResponse(200, "Logout successful", null, true));
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Create a new post for an authenticated user
 * @route POST /api/v2/user/post/create
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with post creation status
 */
export const createPost = async (req: any, res: any) => {
    const user = req.user;
    const { title, content } = req.body;

    /**
     * Input Validation
     */
    // Check for authenticated user
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    // Validate required fields
    if (!title || !content) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    "Title and content are required",
                    null,
                    false
                )
            );
    }

    try {
        // Create new post
        const createdPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: user.id,
            },
        });

        if (!createdPost) {
            // Post creation failed
            return res
                .status(500)
                .json(
                    new ApiResponse(500, "Failed to create post", null, false)
                );
        }

        res.status(200).json(
            new ApiResponse(200, "Post created successfully", createdPost, true)
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Show posts by page number for an authenticated user
 * @route GET /api/v2/user/post/show/:page
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with posts for the specified page
 */
export const showPostsByPageNumber = async (req: any, res: any) => {
    const user = req.user;
    const pageNumber = parseInt(req.params.page) || 1;
    const postsPerPage = parseInt(process.env.POST_PER_PAGE || "5");

    /**
     * Input Validation
     */
    // Check for authenticated user
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        // Fetch posts with pagination
        const posts = await prisma.post.findMany({
            where: { authorId: user.id },
            skip: (pageNumber - 1) * postsPerPage,
            take: postsPerPage,
            orderBy: { createdAt: "desc" },
        });
        if (!posts || posts.length === 0) {
            // No posts found
            return res
                .status(404)
                .json(new ApiResponse(404, "No posts found", null, false));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Posts retrieved successfully",
                    posts,
                    true
                )
            );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Get user profile details
 * @route GET /api/v2/user/profile
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with user profile details
 */
export const userProfile = async (req: any, res: any) => {
    const user = req.user;

    /**
     * Input Validation
     */
    // Check for authenticated user
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        // Fetch user counts
        const followers = await prisma.follow.findMany({
            where: { followingId: user.id },
        });
        const following = await prisma.follow.findMany({
            where: { followerId: user.id },
        });

        res.status(200).json(
            new ApiResponse(
                200,
                "User profile retrieved",
                {
                    id: user.id,
                    username: user.username,
                    followers,
                    following,
                },
                true
            )
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};
