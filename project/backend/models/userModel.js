import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.googleId ? false : true;
      },
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },
    profileImage: {
      type: String,
      default: "",
      validate: {
        validator: (v) => validator.isURL(v) || v === "",
        message: "Profile image must be a valid URL",
      },
    },
    isVerified: { type: Boolean, default: false },
    location: { type: String, default: "" },
    skills: { type: [String], default: [] },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
      default: [],
    },
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    googleId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
