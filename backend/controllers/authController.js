import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendOTPEmail } from "../config/nodemailer.js";
import { generateOTP } from "../utils/generateOTP.js";

const prisma = new PrismaClient();


// --------------------- SIGNUP ---------------------
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 min

    await prisma.oTP.create({
      data: { code, expiresAt, type: "signup", userId: user.id },
    });

    await sendOTPEmail(email, code);

    return res.json({ message: "OTP sent", userId: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------- VERIFY OTP ---------------------
export const verifyOTP = async (req, res) => {
  const { userId, code, type } = req.body;

  try {
    const otp = await prisma.oTP.findFirst({
      where: { userId, code, type, used: false },
    });

    if (!otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otp.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    await prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    if (type === "signup") {
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: true },
      });
    }

    return res.json({ message: "Verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------- LOGIN ---------------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive)
      return res
        .status(400)
        .json({ message: "Invalid credentials or unverified" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      message: "Logged in",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------- LOGOUT ---------------------
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};


// --------------------- FORGOT PASSWORD ---------------------
export const forgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "No user found" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.oTP.create({
      data: { code, expiresAt, type: "forgot", userId: user.id },
    });

    await sendOTPEmail(email, code);

    return res.json({ message: "OTP sent", userId: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------- RESET PASSWORD ---------------------
export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });

    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
