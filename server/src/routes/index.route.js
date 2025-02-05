import ApiResponse from "../ApiResponse.js";

export const securedCookieParserOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "None",
};

export const unknownErrorResponse = (res) => {
  return res
    .status(500)
    .json(new ApiResponse(500, "Server error", {}, false));
};
