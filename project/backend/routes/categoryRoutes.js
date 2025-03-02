import express from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  getAllCategories,
  getCategoryById,
} from "../controllers/categoryController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(authenticate, authorizeAdmin, createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, removeCategory);

export default router;
