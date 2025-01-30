import {Router} from "express"

const profileRouter = Router();

profileRouter.get("/:userId", async (req, res) => {
    try {
      const userId = req.params?.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json(new ApiResponse(404, "User not found", {}, false));
      }
      console.log(user);
  
      return res.status(200).json(
        new ApiResponse(
          200,
          "User found",
          {
            _id: user._id,
            username: user.username,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
          },
          true
        )
      );
    } catch (error) {
      console.error(error);
    }
  });

export default profileRouter;