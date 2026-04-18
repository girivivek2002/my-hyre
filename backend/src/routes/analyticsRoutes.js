import express from "express";
import { getRecruiterAnalytics } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(requireAuth);

router.get("/", getRecruiterAnalytics);

export default router;
