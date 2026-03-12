import { asyncHandler } from "../middleware/async.middleware.js";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.model.js";
import { date } from "yup";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Create tokens
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Store refresh token in DB (one session per login)
  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
  });

  // Send refresh token as HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Fillter User
  const fillteredUser = {}
  fillteredUser.name = user.name;
  fillteredUser.email = user.email
  fillteredUser.role = user.role

  // Send access token in response body
  res.status(200).json({
    success: true,
    message: `Welcome back ${user.name}`,
    data: {
      accessToken,
      user: fillteredUser
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await Session.deleteOne({ refreshToken: hashedRefreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }

  let decoded;

  // 1️⃣ Verify token signature & expiry
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 2️⃣ Check if token exists in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await Session.findOne({
    userId: decoded.id,
    refreshToken: hashedToken,
  });

  // 🚨 Token reuse detection
  if (!session) {
    // Delete all sessions for that user
    await Session.deleteMany({ userId: decoded.id });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    throw new AppError("Session reuse detected. Please login again.", 401);
  }

  await Session.deleteOne({ refreshToken: hashedToken });

  // 3️⃣ Generate new tokens
  const newAccessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  // create a new session
  await Session.create({
    userId: decoded.id,
    refreshToken: hashedRefreshToken,
  });

  // 5️⃣ Send new refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 6️⃣ Send new access token
  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "_id name email phone role",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
