import React, { useState, useContext } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  async function submit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Fill email and password");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      toast.success("Welcome back");
      localStorage.setItem("user", JSON.stringify(res.data.user));
   
      window.location.href = "/";
       toast.success("Welcome back");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }



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
          Welcome Back
        </h2>

        <form onSubmit={submit} className="space-y-4">
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
            <input
              type="password"
              className={`mt-1 w-full px-4 py-2 rounded-xl outline-none transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-[#3a2b27] border border-[#6b4c43] text-[#f3e0d3] focus:ring-2 focus:ring-[#c99b74]"
                  : "bg-[#f5efff] border border-[#c8b8ff] text-[#4b4368] focus:ring-2 focus:ring-[#a48bff]"
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl font-semibold flex items-center justify-center transition-all duration-200
            ${
              theme === "dark"
                ? "bg-[#8a5a3d] hover:bg-[#714a33] text-white"
                : "bg-[#7b5af7] hover:bg-[#6f4ee8] text-white shadow-lg shadow-[#cabdff]/50"
            }`}
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm opacity-80">
          <a
            href="/forgot"
            className={`font-medium ${
              theme === "dark" ? "text-[#ffddb7]" : "text-[#7b5af7]"
            }`}
          >
            Forgot password?
          </a>
        </div>

        <p className="mt-3 text-center text-sm opacity-80">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className={`${theme === "dark" ? "text-[#ffddb7]" : "text-[#7b5af7]"} font-medium`}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
