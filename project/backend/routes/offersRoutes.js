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

router
  .route("/")
  .post(authenticate, createOffer)
  .get(authenticate, getAllOffers);

router.route("/filtered").get(authenticate, getFilteredOffers);

router
  .route("/:id")
  .get(authenticate, getOfferById)
  .delete(authenticate, authorizeAdmin, deleteOffer);

export default router;
