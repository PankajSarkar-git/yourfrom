import jwt from "jsonwebtoken";
import User from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Decode only for debugging (does not verify)
    const decoded = jwt.decode(token);

    console.log("========== JWT DEBUG ==========");
    console.log("Current Time (Unix):", Math.floor(Date.now() / 1000));
    console.log("Issued At (iat):", decoded?.iat);
    console.log("Expires At (exp):", decoded?.exp);
    console.log(
      "Is Expired:",
      decoded
        ? Math.floor(Date.now() / 1000) > decoded.exp
        : "Invalid Token"
    );
    console.log("===============================");

    // Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("Verified Payload:", decodedToken);

    // Find user
    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    // Preserve ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("========== JWT ERROR ==========");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("===============================");

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Access token expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid access token");
    }

    if (error instanceof jwt.NotBeforeError) {
      throw new ApiError(401, "Token not active yet");
    }

    throw new ApiError(500, "Internal server error");
  }
});