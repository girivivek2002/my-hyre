import express from "express";
import { getProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all user routes
router.use(requireAuth);

router.get("/me", getProfile);

export default router;
