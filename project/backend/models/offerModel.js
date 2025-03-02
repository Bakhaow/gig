import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  budgetNegotiable: {
    type: Boolean,
    default: false,
  },
  negotiationPrice: {
    type: Number,
    required: function () {
      return this.budgetNegotiable;
    },
    validate: {
      validator: function (value) {
        if (this.budgetNegotiable && !value) {
          return false;
        }
        return true;
      },
      message: "Negotiation price is required when the budget is negotiable.",
    },
    default: function () {
      return this.budget;
    },
  },
  expirationTime: {
    type: Date,
    default: null,
  },
  restrictedToAdvancedProviders: {
    type: Boolean,
    default: false,
  },
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["open", "inProgress", "completed", "cancelled"],
    default: "open",
  },
  appliedProviders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  applicationMessages: [
    {
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded", "disputed"],
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    required: function () {
      return this.paymentStatus === "paid";
    },
  },
  completedByClient: {
    type: Boolean,
    default: false,
  },
  serviceCompletionProof: {
    type: String,
    required: function () {
      return this.completedByClient === true;
    },
    default: "",
  },
  clientRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  providerRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  disputeStatus: {
    type: String,
    enum: ["none", "underReview", "resolved"],
    default: "none",
  },
  chatMessages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update `updatedAt` before saving
OfferSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Offer", OfferSchema);
