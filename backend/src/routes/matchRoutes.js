import express from "express";
import { getMatches, testRoute } from "../controllers/matchController.js";

const router = express.Router();

router.get("/test", testRoute);
router.get("/:jobId", getMatches);

export default router;
