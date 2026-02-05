import prisma from "../../db/prisma.db.js";
import ApiResponse from "../../utils/ApiResponse.js";

/**
 * Get paginated posts with filters and sorting
 * @route GET /api/v2/post?pageNumber=&tags=&keywords=&startDate=&endDate=&orderBy=&asc=
 * @param req Request object containing query parameters for filtering and sorting posts
 * @param res Response object to send the paginated posts
 * @returns ApiResponse containing the paginated posts
 */
export const getPosts = async (req: any, res: any) => {
    const user = req.user;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(process.env.POSTS_PER_PAGE || "10");
    const skip = (pageNumber - 1) * pageSize;
    const TRUNCATE_LIMIT = 200;

    // Build query pipeline
    const pipeline: any = { where: {}, orderBy: {} };

    /**
     * Filters
     */
    // Date range filter
    const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date("1970-01-01");

    const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : new Date();

    console.log(startDate, endDate);
    pipeline.where = {
        ...pipeline.where,
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
    };

    // Tags filter
    if (req.query?.tags) {
        const tagsArray = (req.query.tags as string)
            .split(",")
            .map((tag) => tag.trim());

        pipeline.where.tags = {
            ...pipeline.where.tags,
            some: { name: { in: tagsArray, mode: "insensitive" } },
        };
    }

    // Keywords filter
    if (req.query?.keywords) {
        const keywords = (req.query.keywords as string).trim();
        pipeline.where = {
            ...pipeline.where,
            OR: [
                { title: { contains: keywords, mode: "insensitive" } },
                { content: { contains: keywords, mode: "insensitive" } },
                {
                    author: {
                        username: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        };
    }

    // Author filter
    if (req.query?.usernames) {
        const usernames = req.query.usernames
            .split(",")
            .map((u: string) => u.trim());
        pipeline.where.author = {
            ...pipeline.where.author,
            username: { in: usernames, mode: "insensitive" },
        };
    }

    // Sorting
    const order =
        req.query?.asc === true || req.query?.asc === "true" ? "asc" : "desc";
    if (req.query?.orderBy === "likes") {
        pipeline.orderBy = { likes: { _count: order } };
    } else if (req.query?.orderBy === "comments") {
        pipeline.orderBy = { comments: { _count: order } };
    } else if (req.query?.orderBy === "date") {
        pipeline.orderBy = { createdAt: order };
    }

    try {
        // Fetch posts from database
        const rawPosts = await prisma.post.findMany({
            ...pipeline,
            skip: skip,
            take: pageSize,
            include: {
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: user ? { where: { userId: user.id } } : true,
                author: {
                    select: {
                        fullname: true,
                        username: true,
                        avatar: true,
                    },
                },
                tags: { select: { name: true } },
            },
        });

        // Process posts (truncate content, flatten counts, check if liked)
        const posts = rawPosts.map((post: any) => {
            return {
                ...post,
                // Truncate Content
                content:
                    post.content.length > TRUNCATE_LIMIT
                        ? post.content.substring(0, TRUNCATE_LIMIT) + "..."
                        : post.content,

                // Flatten Counts (Optional cleanup)
                likesCount: post._count.likes,
                commentsCount: post._count.comments,
                isLiked: Array.isArray(post.likes) && post.likes.length > 0,
                tags: post.tags?.map((tag: any) => tag.name),

                // Remove internal fields
                _count: undefined,
                likes: undefined,
            };
        });

        res.status(200).json(
            new ApiResponse(200, "Posts fetched successfully", posts, true)
        );
    } catch (error) {
        console.log("Error in getPosts:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Get post by ID
 * @route GET /api/v2/post/:postId?relatedPosts=
 * @param req Request object
 * @param res Response object
 * @returns ApiResponse containing the post details
 */
export const getPostById = async (req: any, res: any) => {
    const postId = req.params?.postId;
    const user = req.user;

    if (!postId) {
        // Missing postId parameter
        return res
            .status(400)
            .json(new ApiResponse(400, "Post ID is required", null, false));
    }

    try {
        // Fetch post from database
        const fetchPost = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                likes: user ? { where: { userId: user.id } } : false,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                username: true,
                                fullname: true,
                                avatar: true,
                            },
                        },
                    },
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                tags: { select: { name: true } },
            },
        });

        if (!fetchPost) {
            // Post not found
            return res
                .status(404)
                .json(new ApiResponse(404, "Post not found", null, false));
        }

        let relatedPosts: any[] = [];
        if (req.query?.relatedPosts === "true") {
            // Fetch related posts based on tags and title
            relatedPosts = await prisma.post.findMany({
                where: {
                    id: { not: fetchPost.id },
                    OR: [
                        {
                            title: {
                                contains: fetchPost?.title,
                                mode: "insensitive",
                            },
                        },
                        {
                            tags: {
                                some: {
                                    name: {
                                        in:
                                            fetchPost?.tags?.map(
                                                (tag: any) => tag.name
                                            ) || [],
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    ],
                },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
            });

            // Process related posts (flatten counts)
            relatedPosts = relatedPosts.map((post) => ({
                ...post,
                likesCount: post._count.likes,
                commentsCount: post._count.comments,
                _count: undefined,
            }));
        }

        // Flatten Counts and check if liked
        const post = {
            ...fetchPost,
            likesCount: fetchPost._count.likes,
            commentsCount: fetchPost._count.comments,
            isLiked:
                Array.isArray(fetchPost.likes) && fetchPost.likes.length > 0,
            tags: fetchPost.tags?.map((tag: any) => tag.name),
            relatedPosts: relatedPosts,
            likes: undefined,
            _count: undefined,
        };

        res.status(200).json(
            new ApiResponse(200, "Post fetched successfully", post, true)
        );
    } catch (error) {
        console.log("Error in getPostById:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Comment on a post
 * @route POST /api/v2/post/comment/create/:postId
 * @param req Request object
 * @param res Response object
 * @returns ApiResponse for comment creation
 */
export const commentOnPost = async (req: any, res: any) => {
    const user = req.user;
    const postId = req.params?.postId;
    const content = req.body?.content;

    if (!postId || !content) {
        // Missing postId or content parameter
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    "Post ID and content are required",
                    null,
                    false
                )
            );
    }

    if (!user) {
        // Check if user is authenticated
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            // Post not found
            return res
                .status(404)
                .json(new ApiResponse(404, "Post not found", null, false));
        }

        // Create comment
        const createComment = await prisma.comment.create({
            data: {
                postId: postId,
                content: content,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!createComment) {
            // Failed to create comment
            return res
                .status(500)
                .json(
                    new ApiResponse(
                        500,
                        "Failed to create comment",
                        null,
                        false
                    )
                );
        }

        res.status(201).json(
            new ApiResponse(
                201,
                "Comment created successfully",
                createComment,
                true
            )
        );
    } catch (error) {
        console.log("Error in commentOnPost:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Toggle like on a post
 * @route POST /api/v2/post/like/toggle/:postId
 * @param req Request object
 * @param res Response object
 * @returns ApiResponse for like toggle action
 */
export const toggleLike = async (req: any, res: any) => {
    const user = req.user;
    const postId = req.params?.postId;

    // Check if postId is provided
    if (!postId) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Post ID is required", null, false));
    }

    // Check if user is authenticated
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            // Post not found
            return res
                .status(404)
                .json(new ApiResponse(404, "Post not found", null, false));
        }

        const isLiked =
            (await prisma.like.findFirst({
                where: {
                    userId: user.id,
                    postId: post.id,
                },
            })) !== null;

        if (isLiked) {
            // Unlike
            await prisma.like.deleteMany({
                where: {
                    userId: user.id,
                    postId: post.id,
                },
            });

            const likesCount = await prisma.like.count({
                where: { postId: post.id },
            });

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Unliked successfully",
                    {
                        isLiked: !isLiked,
                        likesCount: likesCount,
                    },
                    true
                )
            );
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    postId: post.id,
                },
            });

            const likesCount = await prisma.like.count({
                where: { postId: post.id },
            });
            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Liked successfully",
                    {
                        isLiked: !isLiked,
                        likesCount: likesCount,
                    },
                    true
                )
            );
        }
    } catch (error) {
        console.log("Error in toggleLike:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Create a new post
 * @route POST /api/v2/post/create
 * @param req Request object
 * @param res Response object
 * @returns ApiResponse for post creation
 */
export const createPost = async (req: any, res: any) => {
    const user = req.user;
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    const { title, content, tags } = req.body;

    // Basic Validation
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

    // Safe Tag Processing
    // Ensure tags is an array, otherwise default to empty []
    let processedTags: any[] = [];
    if (Array.isArray(tags)) {
        processedTags = tags.map((tag: string) => ({
            where: { name: tag.trim().toLowerCase() },
            create: { name: tag.trim().toLowerCase() },
        }));
    }

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: user.id,
                tags:
                    processedTags.length > 0
                        ? {
                              connectOrCreate: processedTags,
                          }
                        : undefined,
            },
            include: {
                tags: {
                    select: { name: true },
                },
            },
        });

        // Flatten tags for cleaner API response
        const formattedPost = {
            ...post,
            tags: post.tags.map((t) => t.name),
        };

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    "Post created successfully",
                    formattedPost,
                    true
                )
            );
    } catch (error) {
        console.log("Error in createPost:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};
