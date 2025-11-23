import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext.jsx";
import Loader from "../components/Loader";

export default function Forgot() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // -------------------------
  // STEP 1: SEND OTP
  // -------------------------
  async function sendOtp(e) {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot", { email });
      toast.success("OTP sent to your email");

      setUserId(res.data.userId);
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // STEP 2: VERIFY OTP
  // -------------------------
  async function verifyOtp(e) {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP");

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        userId,
        code: otp,
        type: "forgot",
      });

      toast.success("OTP Verified");
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // STEP 3: RESET PASSWORD
  // -------------------------
  async function resetPassword(e) {
    e.preventDefault();

    if (!pass1 || !pass2) return toast.error("Enter both passwords");
    if (pass1 !== pass2) return toast.error("Passwords do not match");
    if (pass1.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        userId,
        newPassword: pass1,
      });

      toast.success("Password reset successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Error resetting password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center py-10 px-6 transition
      ${
        theme === "dark"
          ? "bg-[#1b120f] text-[#f8e8d8]"
          : "bg-[#f5f6fa] text-[#2b2b2b]"
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl p-10 shadow-2xl transition border
        ${
          theme === "dark"
            ? "bg-[#2b1f1b] border-[#5a3c33] shadow-black/40"
            : "bg-white border-gray-200 shadow-gray-300"
        }`}
      >
        {/* HEADING */}
        <h2
          className={`text-4xl font-bold text-center mb-3 
          ${theme === "dark" ? "text-[#f5d4b8]" : "text-[#3e2723]"}`}
        >
          Forgot Password
        </h2>

        <p className="text-center mb-10 opacity-80 text-lg">
          Enter your email to reset your password.  
          Follow the steps below.
        </p>

        {/* STEP 1 → EMAIL */}
        {!otpSent && (
          <form onSubmit={sendOtp} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className={`w-full px-4 py-3 rounded-xl text-lg outline-none
                  ${
                    theme === "dark"
                      ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                      : "bg-gray-100 border border-gray-300 text-black focus:ring-2 focus:ring-purple-500"
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 text-lg rounded-xl font-semibold flex justify-center
                ${
                  theme === "dark"
                    ? "bg-[#8a5a3d] hover:bg-[#774d35] text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
            >
              {loading ? <Loader /> : "Generate OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 → OTP */}
        {otpSent && !otpVerified && (
          <form onSubmit={verifyOtp} className="space-y-6 mt-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Enter OTP</label>
              <input
                maxLength={6}
                placeholder="123456"
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl outline-none font-bold
                ${
                  theme === "dark"
                    ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                    : "bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-purple-500"
                }`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg rounded-xl font-semibold flex justify-center
                ${
                  theme === "dark"
                    ? "bg-[#8a5a3d] hover:bg-[#6f4932] text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              {loading ? <Loader /> : "Verify OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 → RESET PASSWORD */}
        {otpVerified && (
          <form onSubmit={resetPassword} className="space-y-6 mt-8">
            {/* NEW PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">New Password</label>
              <input
                type="password"
                placeholder="New password"
                className={`w-full px-4 py-3 rounded-xl text-lg outline-none
                  ${
                    theme === "dark"
                      ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3]"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className={`w-full px-4 py-3 rounded-xl text-lg outline-none
                  ${
                    theme === "dark"
                      ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3]"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 text-lg rounded-xl font-semibold flex justify-center
                ${
                  theme === "dark"
                    ? "bg-[#a56548] hover:bg-[#8d533c] text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {loading ? <Loader /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
