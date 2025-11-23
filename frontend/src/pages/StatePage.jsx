import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { Copy, Share2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

// Skeleton Component
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-[#3a2418] rounded-2xl h-40 w-full"></div>
  );
}

export default function StatsPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dark = theme === "dark";

  async function loadStats() {
    try {
      const res = await api.get(`/links/${code}/summary?days=30`);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load stats");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStats();
  }, [code]);

  const COLORS = dark
    ? ["#c69c72", "#8b5e34"]
    : ["#a77cff", "#c9b6ff"]; // light-mode purple tones

  if (loading) {
    return (
      <div className={`min-h-screen p-6 grid gap-6 ${dark ? "bg-[#2b1a12]" : "bg-white"}`}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-20 text-lg text-red-500">
        Stats not found for this link.
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-8 transition ${
      dark ? "bg-[#2b1a12] text-white" : "bg-white text-gray-900"
    }`}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
            ${dark 
              ? "bg-[#5b3928] border-[#704c35] hover:bg-[#704c35]" 
              : "bg-purple-100 border-purple-300 hover:bg-purple-200"
            }`}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold">
          Stats for <span className="underline">{code}</span>
        </h1>
      </div>

      {/* INFO CARD */}
      <div className={`rounded-2xl shadow p-6 mb-6 border transition
        ${dark ? "bg-[#3a2418] border-[#704c35]" : "bg-purple-50 border-purple-200"}
      `}>

        <h2 className="text-xl font-semibold mb-2">Link Details</h2>

        <p><strong>Target URL:</strong> {data.targetUrl}</p>
        <p className="mt-2"><strong>Total Clicks:</strong> {data.clicks}</p>

        <div className="flex gap-3 mt-4">
          {/* COPY */}
          <button
            onClick={() =>{
                navigator.clipboard.writeText(location.origin + "/" + code);
                 toast.success("link copied");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
              ${dark 
                ? "bg-[#5b3928] border-[#704c35] hover:bg-[#704c35]" 
                : "bg-purple-100 border-purple-300 hover:bg-purple-200"
              }`}
          >
            <Copy size={18} /> Copy
          </button>

          {/* SHARE */}
          <button
            onClick={() => navigator.share?.({ url: location.origin + "/" + code })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
              ${dark 
                ? "bg-[#704c35] border-[#8b5e34] hover:bg-[#8b5e34]" 
                : "bg-purple-200 border-purple-300 hover:bg-purple-300"
              }`}
          >
            <Share2 size={18} /> Share
          </button>

          {/* DELETE */}
          <button
            onClick={async () => {
              try {
                await api.delete(`/links/${code}`);
                toast.success("Link deleted");
                navigate("/");
              } catch (e) {
                toast.error("Failed to delete link");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LINE CHART */}
        <div className={`rounded-2xl shadow p-6 border transition
          ${dark ? "bg-[#3a2418] border-[#704c35]" : "bg-purple-50 border-purple-200"}
        `}>
          <h3 className="font-semibold mb-3">Clicks Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.clicksByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className={`rounded-2xl shadow p-6 border transition
          ${dark ? "bg-[#3a2418] border-[#704c35]" : "bg-purple-50 border-purple-200"}
        `}>
          <h3 className="font-semibold mb-3">Daily Click Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.clicksByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className={`rounded-2xl shadow p-6 border md:col-span-2 transition
          ${dark ? "bg-[#3a2418] border-[#704c35]" : "bg-purple-50 border-purple-200"}
        `}>
          <h3 className="font-semibold mb-3">Total Clicks Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Total", value: data.clicks },
                  { name: "Other", value: Math.max(1, data.clicks * 0.2) },
                ]}
                dataKey="value"
                outerRadius={100}
                label
              >
                {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT CLICKS TABLE */}
      <div className={`rounded-2xl shadow p-6 mt-6 border transition
        ${dark ? "bg-[#3a2418] border-[#704c35]" : "bg-purple-50 border-purple-200"}
      `}>
        <h3 className="font-semibold mb-4">Recent Clicks</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">User Agent</th>
                <th className="py-2 px-3">Referrer</th>
              </tr>
            </thead>

            <tbody>
              {data.recentClicks.map((row, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">{new Date(row.ts).toLocaleString()}</td>
                  <td className="py-2 px-3">{row.ip}</td>
                  <td className="py-2 px-3">{row.ua}</td>
                  <td className="py-2 px-3">{row.referrer || "Direct"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
