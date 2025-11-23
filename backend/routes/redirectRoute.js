import { Router } from "express";
import { handleRedirect } from "../controllers/redirectController.js";

const router = Router();

// Redirect short URL → target URL
router.get("/:code", handleRedirect);

export default router;
