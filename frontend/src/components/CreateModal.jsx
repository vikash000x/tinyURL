import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export default function CreateLinkModal({ open, setOpen, refreshLinks }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [form, setForm] = useState({
    longUrl: "",
    alias: "",
    domain: "tinyurl.com",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.longUrl) return toast.error("Long URL is required");

    setLoading(true);

    try {
      const payload = {
        targetUrl: form.longUrl,
        code: form.alias || undefined,
      };

      await api.post("/links", payload, { withCredentials: true });

      toast.success("Short link created!");
      refreshLinks && refreshLinks();
      setOpen(false);
      setForm({ longUrl: "", alias: "", domain: "tinyurl.com" });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) toast.error("Alias already exists!");
      else toast.error("Error creating the short link.");
    }

    setLoading(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div
        className={`
          w-full max-w-xl rounded-2xl shadow-2xl p-6 relative border
          transition-all duration-300 animate-fadeIn
          ${
            dark
              ? "bg-[#2b1a12] text-white border-[#6d4b35] shadow-[0_0_25px_rgba(90,60,40,0.5)]"
              : "bg-white text-gray-900 border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
          }
        `}
      >

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className={`absolute top-4 right-4 transition 
            ${
              dark
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }
          `}
        >
          <X size={26} />
        </button>

        {/* Heading */}
        <h2
          className={`
            text-3xl font-extrabold mb-6 text-center tracking-wide
            ${dark ? "text-[#e8d6c3]" : "text-purple-700"}
          `}
        >
          Create Short Link
        </h2>

        <form onSubmit={submit} className="space-y-5">

          {/* Long URL */}
          <div>
            <label
              className={`block mb-1 font-semibold ${
                dark ? "text-[#f1dfd0]" : "text-purple-800"
              }`}
            >
              Long URL *
            </label>
            <input
              type="text"
              name="longUrl"
              value={form.longUrl}
              onChange={handleChange}
              placeholder="Paste long URL here"
              className={`
                w-full px-4 py-3 rounded-xl border shadow
                focus:ring-2 outline-none transition
                ${
                  dark
                    ? "bg-[#3a2418] border-[#6d4b35] text-white focus:ring-orange-400"
                    : "bg-white border-purple-300 text-gray-900 focus:ring-purple-500"
                }
              `}
            />
          </div>

          {/* Domain */}
          <div>
            <label
              className={`block mb-1 font-semibold ${
                dark ? "text-[#f1dfd0]" : "text-purple-800"
              }`}
            >
              Domain
            </label>

            <div className="flex items-center gap-3">
              <select
                name="domain"
                value={form.domain}
                onChange={handleChange}
                className={`
                  px-4 py-3 rounded-xl border shadow
                  focus:ring-2 outline-none transition 
                  ${
                    dark
                      ? "bg-[#3a2418] border-[#6d4b35] text-white focus:ring-orange-400"
                      : "bg-white border-purple-300 text-gray-900 focus:ring-purple-500"
                  }
                `}
              >
                <option value="tinyurl.com">http://localhost:5173</option>
              </select>

              <span className={`${dark ? "text-gray-300" : "text-gray-700"}`}>
                /
              </span>
            </div>
          </div>

          {/* Alias */}
          <div>
            <label
              className={`block mb-1 font-semibold ${
                dark ? "text-[#f1dfd0]" : "text-purple-800"
              }`}
            >
              Custom Alias (optional)
            </label>
            <input
              type="text"
              name="alias"
              value={form.alias}
              onChange={handleChange}
              placeholder="example: vikash123"
              className={`
                w-full px-4 py-3 rounded-xl border shadow
                focus:ring-2 outline-none transition
                ${
                  dark
                    ? "bg-[#3a2418] border-[#6d4b35] text-white focus:ring-orange-400"
                    : "bg-white border-purple-300 text-gray-900 focus:ring-purple-500"
                }
              `}
            />
            <p
              className={`text-xs mt-1 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Must be at least 5 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-xl text-lg font-bold shadow-md transition 
              ${
                dark
                  ? "bg-[#7b5e47] hover:bg-[#8c6e54] text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }
              disabled:opacity-60
            `}
          >
            {loading ? "Creating..." : "Create Short Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
