import express from "express";
import { OAuth2Client } from "google-auth-library";
import { authenticate } from "../middlewares/authMiddleware.js";
import { googleAuth } from "../controllers/googleController.js";

const router = express.Router();
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

router.post("/", googleAuth);

export default router;
