import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import argon2 from "argon2";
import createToken from "../utils/createToken.js";
import validator from "validator";

const validatePassword = (password) => {
  // Minimum length of 8 characters
  if (!validator.isLength(password, { min: 8 })) {
    return "Password must be at least 8 characters long";
  }
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null; // Password is valid
};

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate and sanitize inputs
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const sanitizedEmail = validator.escape(email);
  const sanitizedUsername = validator.escape(username);

  const userExists = await User.findOne({ email: sanitizedEmail });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  let hashedPassword;
  try {
    hashedPassword = await argon2.hash(password);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error hashing password" });
  }

  const validRoles = ["customer", "provider"];

  const newUser = new User({
    username: sanitizedUsername,
    email: sanitizedEmail,
    password: hashedPassword,
    role: validRoles.includes(role) ? role : "customer",
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  const sanitizedEmail = validator.escape(email);

  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    createToken(res, user._id);

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
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Authentication failed" });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ success: true, data: {} });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, data: users });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = validator.escape(req.body.username) || user.username;
    user.email = validator.escape(req.body.email) || user.email;
    if (req.body.password) {
      const passwordError = validatePassword(req.body.password);
      if (passwordError) {
        return res.status(400).json({ success: false, message: passwordError });
      }
      user.password = await argon2.hash(req.body.password);
    }
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
        token: createToken(res, updatedUser._id),
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = validator.escape(req.body.username) || user.username;
    user.email = validator.escape(req.body.email) || user.email;
    if (req.body.password) {
      const passwordError = validatePassword(req.body.password);
      if (passwordError) {
        return res.status(400).json({ success: false, message: passwordError });
      }
      user.password = await argon2.hash(req.body.password);
    }
    if (req.body.hasOwnProperty("isAdmin")) {
      user.isAdmin = Boolean(req.body.isAdmin);
    }
    if (req.body.hasOwnProperty("role")) {
      user.role = req.body.role;
    }
    user.location = req.body.location || user.location;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    } else {
      await user.deleteOne({ _id: req.params.id });
      res.json({ success: true, message: "User deleted" });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getUserById,
  updateUserById,
  deleteUserById,
};
