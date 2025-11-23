import { Router } from "express";
import {
  signup,
  verifyOTP,
  login,
  logout,
  forgot,
  resetPassword
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgot);
router.post("/reset-password", resetPassword);

export default router;
