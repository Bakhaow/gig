import Offer from "../models/offerModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import validator from "validator";

const validateOfferInput = ({
  title,
  description,
  budget,
  budgetNegotiable,
  category,
}) => {
  const errors = {};

  if (!validator.isLength(title, { min: 3 })) {
    errors.title = "Title must be at least 3 characters long";
  }

  if (!validator.isLength(description, { min: 100 })) {
    errors.description = "Description must be at least 100 characters long";
  }

  if (!category || validator.isEmpty(category)) {
    errors.category = "Category is required";
  }

  if (!validator.isNumeric(String(budget)) || Number(budget) <= 0) {
    errors.budget = "Budget must be a positive number";
  }

  if (typeof budgetNegotiable !== "boolean") {
    errors.budgetNegotiable = "Budget negotiable must be a boolean value";
  }

  return errors;
};

const createOffer = asyncHandler(async (req, res) => {
  const { title, description, budget, budgetNegotiable, category } = req.body;
  const client = req.user.id;

  const validationErrors = validateOfferInput({
    title,
    description,
    budget,
    budgetNegotiable,
    category,
  });
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  try {
    const offer = await Offer.create({
      title: validator.escape(title),
      description: validator.escape(description),
      client,
      budget,
      budgetNegotiable,
      category,
    });

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating offer",
      error: error.message,
    });
  }
});

const getAllOffers = asyncHandler(async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message,
    });
  }
});

const getOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid offer ID format",
    });
  }

  const offer = await Offer.findById(id);

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...offer.toObject(),
      title: validator.unescape(offer.title),
      description: validator.unescape(offer.description),
    },
  });
});

const getFilteredOffers = asyncHandler(async (req, res) => {
  try {
    const {
      category,
      minBudget,
      maxBudget,
      searchTerm,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      const sortOrder = order === "asc" ? 1 : -1;

      switch (field) {
        case "date":
          sort = { createdAt: sortOrder };
          break;
        case "budget":
          sort = { budget: sortOrder };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const skip = (page - 1) * limit;

    const offers = await Offer.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Offer.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: offers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering offers",
      error: error.message,
    });
  }
});

const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validator.isMongoId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid offer ID format",
    });
  }

  try {
    await Offer.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting offer",
      error: error.message,
    });
  }
});

const applyToOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, proposedBudget } = req.body;
  const providerId = req.user._id;

  const offer = await Offer.findById(id);

  if (req.user.role !== "provider") {
    return res.status(403).json({
      success: false,
      message: "Only providers can apply to offers",
    });
  }

  // Check if offer is locked
  if (offer.isLocked) {
    return res.status(400).json({
      success: false,
      message: "This offer is no longer accepting applications",
    });
  }

  // Check if already applied
  if (offer.appliedProviders.includes(providerId)) {
    return res.status(400).json({
      success: false,
      message: "You've already applied to this offer",
    });
  }

  offer.appliedProviders.push(providerId);
  offer.applicationMessages.push({
    provider: providerId,
    message: validator.escape(message),
    proposedBudget,
    status: "pending",
  });

  await offer.save();

  res.status(201).json({
    success: true,
    message: "Application submitted",
  });
});

const getOfferApplications = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id).populate(
    "applicationMessages.provider",
    "username rating profileImage"
  );

  // Authorization check
  if (req.user.role === "client") {
    if (offer.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these applications",
      });
    }
  } else if (req.user.role === "provider") {
    // Filter only the provider's own application
    offer.applicationMessages = offer.applicationMessages.filter(
      (app) => app.provider._id.toString() === req.user._id.toString()
    );
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view applications",
    });
  }

  res.status(200).json({
    success: true,
    data: offer.applicationMessages,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { offerId, applicationId } = req.params;
  const { status } = req.body;

  const offer = await Offer.findById(offerId);

  if (offer.isLocked) {
    return res.status(400).json({
      success: false,
      message: "Offer already has an accepted provider",
    });
  }

  // Add null checks
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  // Verify ownership using client reference
  if (offer.client.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to modify this application",
    });
  }

  const application = offer.applicationMessages.id(applicationId);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }

  // Update application and offer status
  if (status === "accepted") {
    offer.status = "inProgress";
    offer.selectedProvider = application.provider;
    offer.isLocked = true;

    // Reject all other pending applications
    const acceptedApplicationId = application._id;
    offer.applicationMessages.forEach((app) => {
      if (
        app._id.toString() !== acceptedApplicationId.toString() &&
        app.status === "pending"
      ) {
        app.status = "rejected";
      }
    });
  }

  application.status = status;
  await offer.save();

  res.status(200).json({ success: true });
});

export {
  createOffer,
  getAllOffers,
  getOfferById,
  getFilteredOffers,
  deleteOffer,
  applyToOffer,
  getOfferApplications,
  updateApplicationStatus,
};
