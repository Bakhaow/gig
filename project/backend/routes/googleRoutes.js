import express from "express";
import { googleAuth } from "../controllers/googleController.js";

const router = express.Router();

router.post("/", googleAuth);

export default router;
