import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validator from "validator";

const validateCategoryName = (name) => {
  if (!validator.isLength(name, { min: 3 })) {
    return "Name must be at least 3 characters long";
  }
  return null;
};

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const nameError = validateCategoryName(name);
    if (nameError) {
      return res.status(400).json({ success: false, message: nameError });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await new Category({
      name: validator.escape(name),
    }).save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating category" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const nameError = validateCategoryName(name);
    if (nameError) {
      return res.status(400).json({ success: false, message: nameError });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    category.name = validator.escape(name);
    const updatedCategory = await category.save();
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating category" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    return res.status(200).json({ success: true, message: "Category removed" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error removing category" });
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching category" });
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  getAllCategories,
  getCategoryById,
};
