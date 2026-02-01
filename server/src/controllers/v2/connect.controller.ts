import prisma from "../../db/prisma.db";
import ApiResponse from "../../utils/ApiResponse";

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

    // Logic to follow/unfollow a user
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
