import prisma from "../../db/prisma.db";
import ApiResponse from "../../utils/ApiResponse";

/**
 * Toggle like on a post
 * @route GET /api/v2/post/like/toggle/:postId
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
