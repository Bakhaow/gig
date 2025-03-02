import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import recaptchaMiddleware from "../middlewares/recaptchaMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(recaptchaMiddleware, createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.post("/login", recaptchaMiddleware, loginUser);
router.post("/logout", logoutCurrentUser);

//auth
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// admin
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;
