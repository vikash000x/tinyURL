import React, { useState, useContext } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { theme } = useTheme();

  function validate() {
    if (form.name.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Invalid email";
    if (form.password.length < 6) return "Password must be 6+ characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("OTP sent to your email");
      localStorage.setItem(
        "pendingUser",
        JSON.stringify({ userId: res.data.userId, email: form.email })
      );
      window.location.href = "/verify";
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const getStrength = () => {
    const p = form.password;
    if (!p) return "";
    if (p.length < 6) return "Weak";
    if (/[A-Z]/.test(p) && /\d/.test(p) && p.length >= 8) return "Strong";
    return "Medium";
  };

  const strengthColor = {
    Weak: "bg-red-500",
    Medium: "bg-yellow-500",
    Strong: "bg-green-500",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-300
      ${
        theme === "dark"
          ? "bg-[#1b120f] text-[#f8e8d8]"
          : "bg-gradient-to-br from-[#fdf6ec] via-[#ece7ff] to-[#fdf6ec] text-[#4e4668]"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-xl border transition-all duration-300
        ${
          theme === "dark"
            ? "bg-[#2b1f1b] border-[#5a3c33]"
            : "bg-white/80 backdrop-blur-xl border-[#d6caff] shadow-lg shadow-[#cabdff]/40"
        }`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6
        ${theme === "dark" ? "text-[#f5d4b8]" : "text-[#5b4bb7]"}`}
        >
          Create an Account
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className={`mt-1 w-full px-4 py-2 rounded-xl outline-none transition-all duration-200
            ${
              theme === "dark"
                ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                : "bg-[#f5efff] border border-[#c8b8ff] text-[#4b4368] focus:ring-2 focus:ring-[#a48bff]"
            }`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className={`mt-1 w-full px-4 py-2 rounded-xl outline-none transition-all duration-200
            ${
              theme === "dark"
                ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                : "bg-[#f5efff] border border-[#c8b8ff] text-[#4b4368] focus:ring-2 focus:ring-[#a48bff]"
            }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className={`mt-1 w-full px-4 py-2 rounded-xl outline-none transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                  : "bg-[#f5efff] border border-[#c8b8ff] text-[#4b4368] focus:ring-2 focus:ring-[#a48bff]"
              }`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 cursor-pointer opacity-70"
              >
                {showPass ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            {/* Strength */}
            {form.password && (
              <div className="mt-2 text-sm font-medium">
                Strength:{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${strengthColor[getStrength()]}`}
                >
                  {getStrength()}
                </span>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className={`mt-1 w-full px-4 py-2 rounded-xl outline-none transition-all
              ${
                theme === "dark"
                  ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                  : "bg-[#f5efff] border border-[#c8b8ff] text-[#4b4368] focus:ring-2 focus:ring-[#a48bff]"
              }`}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />

              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 cursor-pointer opacity-70"
              >
                {showConfirm ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl mt-2 font-semibold flex items-center justify-center transition-all duration-200
          ${
            theme === "dark"
              ? "bg-[#8a5a3d] hover:bg-[#714a33] text-white"
              : "bg-[#7b5af7] hover:bg-[#6f4ee8] text-white shadow-lg shadow-[#cabdff]/50"
          }`}
          >
            {loading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm opacity-80">
          Already have an account?{" "}
          <a
            href="/login"
            className={`font-medium ${
              theme === "dark" ? "text-[#ffddb7]" : "text-[#7b5af7]"
            }`}
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
