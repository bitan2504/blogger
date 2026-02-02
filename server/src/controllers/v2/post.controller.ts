import prisma from "../../db/prisma.db";
import ApiResponse from "../../utils/ApiResponse";

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
    if (
        (req.query?.startDate &&
            !isNaN(new Date(req.query.startDate).getTime())) ||
        (req.query?.endDate && !isNaN(new Date(req.query.endDate).getTime()))
    ) {
        const startDate =
            req.query.startDate && !isNaN(req.query.startDate)
                ? new Date(req.query.startDate)
                : new Date("1970-01-01");
        const endDate =
            req.query.endDate && !isNaN(req.query.endDate)
                ? new Date(req.query.endDate)
                : new Date();

        pipeline.where = {
            ...pipeline.where,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };
    }

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
        const posts = rawPosts.map((post) => {
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
                tags: post.tags?.map((tag) => tag.name),

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
