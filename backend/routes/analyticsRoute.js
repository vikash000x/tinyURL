import { Router } from "express";
import { getSummaryForCode } from "../controllers/analyticsController.js";

const router = Router();

// Summary analytics for a short code
router.get("/:code/summary", getSummaryForCode);

export default router;
