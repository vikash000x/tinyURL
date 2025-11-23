import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validateBody.js";
import {
  createLink,
  listLinks,
  getLinkStats,
  deleteLink
} from "../controllers/linksController.js";
import { getSummaryForCode } from "../controllers/analyticsController.js";

const router = Router();

const postLinkSchema = z.object({
  targetUrl: z.string(),
  code: z.string().optional()
});

// Create short link
router.post("/", validate(postLinkSchema), createLink);

// List all links
router.get("/", listLinks);

// Get stats for a specific link
router.get("/:code", getLinkStats);
router.get('/:code/summary', getSummaryForCode);

// Delete link by code
router.delete("/:code", deleteLink);

export default router;
