import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function HealthCheck() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const dark = theme === "dark";

  async function fetchHealth() {
    setLoading(true);
    try {
      const res = await fetch("https://tiny-url-backend-tau.vercel.app/healthz");
      const json = await res.json();
      setData(json);
    } catch {
      setData({ ok: false, error: "Cannot reach server" });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchHealth();
  }, []);

  function prettyUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 ${
        dark ? "bg-[#2b1a12] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >

      <div
        className={`w-full max-w-lg rounded-2xl p-8 shadow-xl transition-all duration-300 border 
        ${
          dark
            ? "bg-[#3a2418] border-[#5a3827]"
            : "bg-white border-purple-300"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          System Health Check
        </h1>

        {loading ? (
          <div
            className={`text-center py-10 ${
              dark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Loading...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                Status:
              </span>
              <span
                className={`font-semibold ${
                  data.db.ok ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.db.ok ? "OK" : "DOWN"}
              </span>
            </div>

            {/* Uptime */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                Uptime:
              </span>
              <span>{prettyUptime(data.uptime)}</span>
            </div>

            {/* DB Latency */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                DB Latency:
              </span>
              <span>{data.db.latencyMs ?? "--"} ms</span>
            </div>

            {/* Server Time */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                Server time:
              </span>
              <span>{new Date(data.timestamp).toLocaleString()}</span>
            </div>

            {/* Version */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                Version:
              </span>
              <span>{data.version}</span>
            </div>

            {/* Environment */}
            <div className="flex justify-between items-center">
              <span className={dark ? "text-gray-300" : "text-gray-700"}>
                Environment:
              </span>
              <span className="capitalize">{data.env}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchHealth}
              className={`w-full mt-4 p-3 rounded-xl font-semibold transition ${
                dark
                  ? "bg-[#5b3928] hover:bg-[#704c35] text-white border border-[#7a5238]"
                  : "bg-purple-200 hover:bg-purple-300 text-gray-900 border border-purple-400"
              }`}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
