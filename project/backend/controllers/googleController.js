import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import validator from "validator";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: "GOOGLE_CLIENT_ID is missing!" });
    }

    const googleToken = req.body?.token;
    const tokenString =
      typeof googleToken === "object" && googleToken.token
        ? googleToken.token
        : String(googleToken);

    if (!tokenString || typeof tokenString !== "string") {
      return res.status(400).json({ error: "Invalid token format" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenString,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const sanitizedEmail = validator.escape(payload.email);
    const sanitizedName = validator.escape(payload.name);

    let user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      user = new User({
        username: sanitizedName.split(" ")[0],
        email: sanitizedEmail,
        isVerified: true,
        googleId: payload.sub,
      });

      try {
        await user.save();
      } catch (err) {
        return res.status(500).json({ error: "Failed to create user" });
      }
    }

    const jwtToken = createToken(res, user._id);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Google authentication failed" });
  }
};
