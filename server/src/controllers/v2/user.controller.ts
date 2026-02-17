import prisma from "../../db/prisma.db.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Request, Response, CookieOptions } from "express";
import {
    generateAccessToken,
    generateRefreshToken,
    RefreshTokenPayload,
    verifyRefreshToken,
} from "../../utils/AuthToken.js";
import { hashPassword, comparePassword } from "../../utils/HashPassword.js";
import { AuthRequest, AuthUser } from "../../middlewares/auth.middleware.js";
import uploadOnCloud from "../../utils/CloudinaryFileUpload.js";
import fs from "fs";
import jwt, { SignOptions } from "jsonwebtoken";
import sendMail from "../../utils/SendEmail.js";

/**
 * Cookie Parser Options for Secure Cookies
 */
export const securedCookieParserOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};

/**
 * Refresh access token using refresh token
 * @route GET /api/v2/user/refresh-token
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with new access token and refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken =
        req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;

    if (!refreshToken) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Refresh token missing", null, false));
    }

    try {
        const decoded: RefreshTokenPayload | null =
            verifyRefreshToken(refreshToken);

        if (!decoded || !decoded.id) {
            return res
                .status(401)
                .json(
                    new ApiResponse(401, "Invalid refresh token", null, false)
                );
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user || user.refreshToken !== refreshToken) {
            return res
                .status(401)
                .json(
                    new ApiResponse(
                        401,
                        "User not found or invalid refresh token",
                        null,
                        false
                    )
                );
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        res.status(200)
            .cookie("accessToken", accessToken, securedCookieParserOptions)
            .cookie("refreshToken", newRefreshToken, securedCookieParserOptions)
            .json(
                new ApiResponse(
                    200,
                    "Tokens refreshed successfully",
                    {
                        user: {
                            ...updatedUser,
                            password: undefined, // Exclude password from response
                        },
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    true
                )
            );
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal server error", null, false));
    }
};

/**
 * Register a new user
 * @route POST /api/v2/user/register
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with registration status
 */
export const registerUser = async (req: Request, res: Response) => {
    const { username, password, fullname } = req.body;

    if ([username, password, fullname].some((field) => !field)) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Missing required fields", null, false));
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            return res
                .status(409)
                .json(
                    new ApiResponse(409, "Username already exists", null, false)
                );
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                fullname,
            },
        });

        res.status(201).json(
            new ApiResponse(
                201,
                "User registered successfully",
                {
                    user: {
                        ...newUser,
                        password: undefined, // Exclude password from response
                    },
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

/**
 * Login an existing user
 * @route POST /api/v2/user/login
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with login status
 */
export const loginUser = async (req: Request, res: Response) => {
    const { uid, password } = req.body;

    // Check for missing fields
    if ([uid, password].some((field) => !field)) {
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
        const accessToken: string = generateAccessToken(user);
        const refreshToken: string = generateRefreshToken(user);

        // update the recent refresh token
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        res.status(200)
            .cookie("refreshToken", refreshToken, securedCookieParserOptions)
            .cookie("accessToken", accessToken, securedCookieParserOptions)
            .json(
                new ApiResponse(
                    200,
                    "Login successful",
                    {
                        user: {
                            ...updatedUser,
                            password: undefined, // Exclude password from response
                        },
                        accessToken: accessToken,
                        refreshToken: refreshToken,
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

/**
 * Logout an authenticated user
 * @route POST /api/v2/user/logout
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with logout status
 */
export const logoutUser = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;

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
export const createPost = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;
    const { title, content } = req.body;

    // Validate required fields
    if (![title, content].some((field) => !field)) {
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
 * Update user profile details
 * @route PATCH /api/v2/user/profile/update
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with profile update status
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;
    const { username, fullname, bio, dob } = req.body;
    const avatar = req.file;

    try {
        let avatarUrl: string | undefined = undefined;

        if (avatar) {
            const upload = await uploadOnCloud(avatar.path);
            avatarUrl = upload?.url;
        }

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { username },
            });

            if (existingUser && existingUser.id !== user.id) {
                // Username already exists for another user
                return res
                    .status(409)
                    .json(
                        new ApiResponse(
                            409,
                            "Username already exists",
                            null,
                            false
                        )
                    );
            }
        }

        const updateUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                username: username || undefined,
                fullname: fullname || undefined,
                avatar: avatarUrl || undefined,
                bio: bio || undefined,
                dob: dob ? new Date(dob) : undefined,
            },
        });

        const accessToken = generateAccessToken(updateUser);

        res.status(200)
            .cookie("accessToken", accessToken, securedCookieParserOptions)
            .json(
                new ApiResponse(
                    200,
                    "Profile updated successfully",
                    {
                        user: {
                            ...updateUser,
                            password: undefined, // Exclude password from response
                        },
                        accessToken,
                    },
                    true
                )
            );
    } catch (error) {
        console.log(error);
        res.status(500).json(
            new ApiResponse(500, "Internal Server Error", null, false)
        );
    } finally {
        if (avatar && fs.existsSync(avatar.path)) {
            fs.unlinkSync(avatar.path);
        }
    }
};

/**
 * Show posts by page number for an authenticated user
 * @route GET /api/v2/user/post/show/:page
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with posts for the specified page
 */
export const showPostsByPageNumber = async (
    req: AuthRequest,
    res: Response
) => {
    const user: AuthUser = req.user as AuthUser;
    const pageNumber = parseInt(String(req.params.page) || "1");
    const postsPerPage = parseInt(process.env.POST_PER_PAGE || "10");

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

        res.status(200).json(
            new ApiResponse(200, "Posts retrieved successfully", posts, true)
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
export const userProfile = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;

    try {
        // Fetch user counts
        const fetchProfile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                avatar: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    },
                },
                posts:
                    req.query.includePosts === "true"
                        ? {
                              select: {
                                  id: true,
                                  title: true,
                                  content: true,
                                  createdAt: true,
                              },
                              take: parseInt(process.env.POST_PER_PAGE || "10"),
                          }
                        : false,
            },
        });

        if (!fetchProfile) {
            return res
                .status(404)
                .json(
                    new ApiResponse(404, "User profile not found", null, false)
                );
        }

        const likesCount = await prisma.like.count({
            where: {
                post: {
                    authorId: user.id,
                },
            },
        });

        const profile = {
            user: {
                id: fetchProfile?.id,
                username: fetchProfile?.username,
                email: fetchProfile?.email,
                createdAt: fetchProfile?.createdAt,
                avatar: fetchProfile?.avatar,
                followerCount: fetchProfile?._count.followers || 0,
                followingCount: fetchProfile?._count.following || 0,
                postCount: fetchProfile?._count.posts || 0,
                likesCount: likesCount || 0,
            },
            posts: fetchProfile.posts || [],
        };

        res.status(200).json(
            new ApiResponse(200, "User profile retrieved", profile, true)
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Get public profile of a user by username
 * @route GET /api/v2/user/:username
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with public profile details
 */
export const publicProfile = async (req: AuthRequest, res: Response) => {
    const { username } = req.params;
    const user: AuthUser = req.user as AuthUser;

    if (
        !username ||
        typeof username !== "string" ||
        username.trim().length === 0
    ) {
        // Username parameter is missing
        return res
            .status(400)
            .json(new ApiResponse(400, "Username is required", null, false));
    }

    try {
        // Fetch user profile by username
        const fetchProfile = await prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                avatar: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    },
                },
                followers: user
                    ? {
                          where: { followerId: user.id },
                          select: { followerId: true },
                      }
                    : false,
                posts:
                    req.query?.includePosts === "true"
                        ? {
                              include: {
                                  likes: user
                                      ? {
                                            where: { userId: user.id },
                                        }
                                      : true,
                                  _count: {
                                      select: { likes: true, comments: true },
                                  },
                              },
                              take: parseInt(process.env.POST_PER_PAGE || "10"),
                          }
                        : false,
            },
        });

        if (!fetchProfile) {
            // User with the given username does not exist
            return res
                .status(404)
                .json(
                    new ApiResponse(404, "User profile not found", null, false)
                );
        }

        // Calculate total likes received across all posts
        const totalLikesReceived = await prisma.like.count({
            where: {
                post: { authorId: fetchProfile.id },
            },
        });

        // Construct public profile response
        const profile = {
            user: {
                id: fetchProfile.id,
                username: fetchProfile.username,
                avatar: fetchProfile.avatar,
                createdAt: fetchProfile.createdAt,
                followerCount: fetchProfile._count.followers,
                followingCount: fetchProfile._count.following,
                postCount: fetchProfile._count.posts,
                likesCount: totalLikesReceived,
                isFollowing:
                    Array.isArray(fetchProfile.followers) &&
                    fetchProfile.followers.length > 0,
            },
            posts: fetchProfile.posts
                ? fetchProfile.posts.map((post: any) => ({
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      createdAt: post.createdAt,
                      likesCount: post?._count?.likes,
                      commentsCount: post?._count?.comments,
                      isLiked:
                          Array.isArray(post?.likes) && post.likes.length > 0,
                  }))
                : [],
        };

        res.status(200).json(
            new ApiResponse(200, "User profile retrieved", profile, true)
        );
    } catch (error) {
        console.log("Error in publicProfile:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Get profile page posts for authenticated user
 * @route GET /api/v2/user/profile/posts/:page
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with profile page posts
 */
export const profilePagePosts = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;
    const pageNumber = parseInt(String(req.params.page) || "1");
    const postsPerPage = parseInt(process.env.POST_PER_PAGE || "10");

    try {
        // Fetch posts with pagination
        const findPosts = await prisma.post.findMany({
            where: { authorId: user.id },
            skip: (pageNumber - 1) * postsPerPage,
            take: postsPerPage,
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { likes: true } },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true },
                },
            },
        });

        // Enhance posts with isLiked property
        const posts = findPosts.map((post: any) => {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                likesCount: post._count.likes,
                isLiked: post.likes.length > 0,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });

        res.status(200).json(
            new ApiResponse(200, "Posts retrieved successfully", posts, true)
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const user: AuthUser = req.user as AuthUser;
    const query = String(req.query.query || "").trim();
    const page = parseInt(String(req.query.page || "1"));

    if (!query || query.length === 0) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, "Query parameter is required", null, false)
            );
    }

    try {
        const fetchUsers = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        fullname: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                fullname: true,
                avatar: true,
                followers: {
                    where: user ? { followerId: user.id } : undefined,
                    select: { followerId: true },
                },
            },
            skip: (page - 1) * 10,
            take: 10,
        });

        const users = fetchUsers.map((user: any) => ({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            isFollowing:
                Array.isArray(user.followers) && user.followers.length > 0,
        }));

        res.status(200).json(
            new ApiResponse(200, "Users retrieved successfully", users, true)
        );
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};
