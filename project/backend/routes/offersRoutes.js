import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
  createOffer,
  getAllOffers,
  getOfferById,
  deleteOffer,
  getFilteredOffers,
} from "../controllers/offerController.js";

const router = express.Router();

router.route("/").post(authenticate, createOffer).get(getAllOffers);

router.route("/filtered").get(getFilteredOffers);

router
  .route("/:id")
  .get(getOfferById)
  .delete(authenticate, authorizeAdmin, deleteOffer);

export default router;
