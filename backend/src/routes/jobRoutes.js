import express from "express";
import { createJob, testRoute } from "../controllers/jobController.js";

const router = express.Router();

router.get("/test", testRoute);
router.post("/create", createJob);

export default router;
