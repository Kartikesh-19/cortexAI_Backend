
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import crypto from "crypto";
import User from "../models/user.modal.js";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    console.log("Login controller reached");

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token is required",
      });
    }

    // Verify Firebase ID token
    const decoded = await getAuth(app).verifyIdToken(token);

    console.log("Firebase user verified:", decoded.uid);

    // Find existing user
    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    // Create new user if not found
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "",
        email: decoded.email || "",
        avatar: decoded.picture || "",
      });

      console.log("New user created");
    } else {
      console.log("Existing user found");
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const key = `session-${sessionId}`;
   await redis.set(key,JSON.stringify({
    userId:user._id,
    name:user.name,
    email:user.email,
    avatar:user.avatar,
    
   }),"EX", 7 * 24 * 60 * 60 )




console.log("Session saved:", (await redis.get(key)) !== null);
console.log("Session TTL:", await redis.ttl(key));

    // res.cookie("session", sessionId, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("session", sessionId, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
console.log(
  "Set-Cookie generated:",
  Boolean(res.getHeader("Set-Cookie"))
);
    // Return user details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session-${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout failed:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};