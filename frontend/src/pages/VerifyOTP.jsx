import React, { useState, useContext } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext.jsx"; // your theme provider

export default function VerifyOTP() {
  const pending = JSON.parse(localStorage.getItem("pendingUser") || "{}");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme(); // light | dark

  async function submit(e) {
    e.preventDefault();
    if (!code) return toast.error("Enter OTP");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        userId: pending.userId,
        code,
        type: "signup",
      });
      toast.success("Verified — you can login now");
      localStorage.removeItem("pendingUser");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-300
      ${
        theme === "dark"
          ? "bg-[#1b120f] text-[#f8e8d8]" // brown-tinted dark mode
          : "bg-[#f5f6fa] text-[#2b2b2b]" // soft clean greyish light mode
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-all duration-300
        ${
          theme === "dark"
            ? "bg-[#2b1f1b] shadow-black/40 border border-[#5a3c33]"
            : "bg-white shadow-gray-300 border border-gray-200"
        }`}
      >
        {/* Heading */}
        <h2
          className={`text-3xl font-bold text-center mb-3 
          ${theme === "dark" ? "text-[#f5d4b8]" : "text-[#333]"}
        `}
        >
          Verify OTP
        </h2>

        <p className="text-center text-sm mb-6 opacity-80">
          Enter the 6-digit verification code sent to <br />
          <span
            className={`font-medium ${
              theme === "dark" ? "text-[#f8d7b5]" : "text-[#4a2c8c]"
            }`}
          >
            {pending.email}
          </span>
        </p>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-5">
          {/* OTP INPUT */}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className={`w-full px-4 py-3 rounded-xl text-lg tracking-widest text-center font-semibold outline-none transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-[#3a2b27] text-[#f3e0d3] border border-[#6b4c43] focus:ring-2 focus:ring-[#c99b74]"
                  : "bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-purple-500"
              }
            `}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center
              ${
                theme === "dark"
                  ? "bg-[#8a5a3d] hover:bg-[#774d35] text-white shadow-md shadow-black/30"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              }
            `}
          >
            {loading ? <Loader /> : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
