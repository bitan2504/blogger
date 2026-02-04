import prisma from "../../db/prisma.db";
import ApiResponse from "../../utils/ApiResponse";
import express from "express";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/AuthToken";
import { hashPassword, comparePassword } from "../../utils/HashPassword";
import { title } from "node:process";

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
        new ApiResponse(
            200,
            "User retrieved successfully",
            {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
            },
            true
        )
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
            avatar: null,
        };

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

    // Check for authenticated user
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        // Fetch user counts
        const fetchProfile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
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
export const publicProfile = async (req: any, res: any) => {
    const { username } = req.params;
    const user = req.user;

    if (!username) {
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
                              select: {
                                  id: true,
                                  title: true,
                                  content: true,
                                  createdAt: true,
                                  likes: user
                                      ? {
                                            where: { userId: user.id },
                                            select: { userId: true },
                                        }
                                      : false,
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
                ? fetchProfile.posts.map((post) => ({
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      createdAt: post.createdAt,
                      likesCount: post?._count.likes,
                      commentsCount: post?._count.comments,
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
export const profilePagePosts = async (req: any, res: any) => {
    const user = req.user;
    const pageNumber = parseInt(req.params.page || "1");
    const postsPerPage = parseInt(process.env.POST_PER_PAGE || "5");

    // Validate user authentication
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

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
        const posts = findPosts.map((post) => {
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

export const searchUsers = async (req: any, res: any) => {
    const { query, page } = req.query;
    const user = req.user;
    if (!query || typeof query !== "string" || query.trim().length === 0) {
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
            skip: ((parseInt(page) || 1) - 1) * 10,
            take: 10,
        });

        const users = fetchUsers.map((user) => ({
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
