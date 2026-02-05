import prisma from "../../db/prisma.db.js";
import ApiResponse from "../../utils/ApiResponse.js";

/**
 * Get posts by username with pagination
 * @route GET /api/v2/connect/:username/posts/:page
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with posts data
 */
export const getPostByUsername = async (req: any, res: any) => {
    const user = req.user;
    const pageNumber = parseInt(req.params?.page || "1");
    const postPerPage = parseInt(process.env.POSTS_PER_PAGE || "10");
    const username = req.params?.username;

    // Validate user authentication
    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    // Check if username is provided
    if (!username || typeof username !== "string" || username.trim() === "") {
        return res
            .status(400)
            .json(new ApiResponse(400, "Username is required", null, false));
    }

    try {
        // Find user by username
        const findUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!findUser) {
            // User not found
            return res
                .status(404)
                .json(new ApiResponse(404, "Username not found", null, false));
        }

        // Fetch posts by the found user's ID with pagination
        const findPosts = await prisma.post.findMany({
            where: { authorId: findUser.id },
            skip: (pageNumber - 1) * postPerPage,
            take: postPerPage,
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { likes: true },
                },
                likes: { where: { userId: user?.id || "" } },
            },
        });

        const posts = findPosts.map(async (post: any) => {
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

        // Return the posts in the response
        res.status(200).json(
            new ApiResponse(200, "Posts retrieved successfully", posts, true)
        );
    } catch (error) {
        console.log("Error in getPostByUsername:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};

/**
 * Toggle follow/unfollow a user
 * @route GET /api/v2/connect/follow/toggle/:username
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response indicating follow/unfollow status
 */
export const toggleFollow = async (req: any, res: any) => {
    const user = req.user;
    const username = req.params?.username;

    // Validate user authentication
    if (!username) {
        return res
            .status(400)
            .json(new ApiResponse(400, "Username is required", null, false));
    }

    if (!user) {
        return res
            .status(401)
            .json(new ApiResponse(401, "Unauthorized", null, false));
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!targetUser) {
            // Target user not found
            return res
                .status(404)
                .json(new ApiResponse(404, "Username not found", null, false));
        }

        if (targetUser.id === user.id) {
            // Cannot follow/unfollow oneself
            return res
                .status(400)
                .json(
                    new ApiResponse(400, "Cannot follow yourself", null, false)
                );
        }

        const isFollowing =
            (await prisma.follow.findFirst({
                where: {
                    followerId: user.id,
                    followingId: targetUser.id,
                },
            })) !== null;

        if (isFollowing) {
            // Unfollow
            await prisma.follow.deleteMany({
                where: {
                    followerId: user.id,
                    followingId: targetUser.id,
                },
            });
            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Unfollowed successfully", null, true)
                );
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId: user.id,
                    followingId: targetUser.id,
                },
            });
            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Followed successfully", null, true)
                );
        }
    } catch (error) {
        console.log("Error in toggleFollow:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error", null, false));
    }
};
