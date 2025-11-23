import { Router } from "express";
import { health } from "../controllers/healthController.js";

const router = Router();

// Health check
router.get("/", health);

export default router;
