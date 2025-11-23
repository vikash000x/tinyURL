import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import CreateLinkModal from "../components/CreateModal";
import { Copy, Plus, Search, ChevronDown,  Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Dashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";
     const [popup, setPopup] = useState({
    open: false,
    url: "",
    code: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [links, setLinks] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("created");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  // Fetch Links
  async function fetchLinks() {
    try {
      setLoading(true);
      const res = await api.get("/links?limit=50");
      setLinks(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  // Debounced Search
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const applySearch = (value) => {
    setSearch(value);

    if (!value) return setFiltered(links);

    const q = value.toLowerCase();

    setFiltered(
      links.filter(
        (link) =>
          link.code.toLowerCase().includes(q) ||
          link.targetUrl.toLowerCase().includes(q)
      )
    );
  };

  const handleSearch = useCallback(debounce(applySearch, 400), [links]);

  // Sorting
  function sortLinks(type) {
    setSortType(type);

    let sorted = [...filtered];

    if (type === "clicks") sorted.sort((a, b) => b.clicks - a.clicks);
    if (type === "az") sorted.sort((a, b) => a.code.localeCompare(b.code));
    if (type === "created") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFiltered(sorted);
  }

  // Copy function
  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div
      className={`p-6 min-h-screen transition ${
        dark ? "bg-[#2b1a12] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 items-center">

        <h1 className="text-3xl font-bold">Links Dashboard</h1>

        <button
          onClick={() => setOpenModal(true)}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition shadow-md
            ${
              dark
                ? "bg-[#5B3A29] hover:bg-[#714d3a] text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          `}
        >
          <Plus size={18} />
          Create Link
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">

        {/* Search */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl w-full md:w-1/3 transition border 
          ${
            dark
              ? "bg-[#3b2519] border-[#5a3a29]"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by code or URL..."
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => sortLinks("created")}
            className={`px-4 py-2 rounded-xl transition shadow-sm border 
              ${
                sortType === "created"
                  ? dark
                    ? "bg-[#5b3928] border-[#7a5238]"
                    : "bg-purple-600 text-white border-purple-700"
                  : dark
                    ? "bg-[#3a2518] border-[#5a3927]"
                    : "bg-gray-100 border-gray-300"
              }`}
          >
            Sort by Created
          </button>

          <button
            onClick={() => sortLinks("clicks")}
            className={`px-4 py-2 rounded-xl transition shadow-sm border 
              ${
                sortType === "clicks"
                  ? dark
                    ? "bg-[#5b3928] border-[#7a5238]"
                    : "bg-purple-600 text-white border-purple-700"
                  : dark
                    ? "bg-[#3a2518] border-[#5a3927]"
                    : "bg-gray-100 border-gray-300"
              }`}
          >
            Sort by Clicks
          </button>

          
        </div>
      </div>

      {/* TABLE */}
      <div
        className={`rounded-xl overflow-hidden shadow-lg border transition
          ${
            dark
              ? "border-[#5a3927] bg-[#3a2418]"
              : "border-gray-300 bg-white"
          }`}
      >
        {/* SKELETON LOADING */}
        {loading && (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-gray-300 dark:bg-[#5a3827]"></div>
            ))}
          </div>
        )}

       

        {!loading && (
        <table className="w-full">
          <thead>
            <tr
              className={`text-left border-b ${
                dark ? "border-[#5a3827]" : "border-gray-300"
              }`}
            >
              <th className="p-4">Short Code</th>
              <th className="p-4">Target URL</th>
              <th className="p-4">Clicks</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((link) => (
              <tr
                key={link.id}
                className={`transition cursor-pointer group
                  ${dark ? "hover:bg-[#593a29]" : "hover:bg-purple-100"}
                `}
                onClick={() => navigate(`/code/${link.code}`)}
              >
                {/* SHORT CODE */}
                <td className="p-4 font-mono relative max-w-[120px] truncate">
                  {"/" + link.code}

                  {/* Tooltip */}
                  <div
                    className="absolute left-0 top-full mt-1 hidden group-hover:flex 
                  items-center gap-2 bg-black text-white px-3 py-2 rounded-xl text-sm
                  z-50 shadow-xl"
                  >
                    {"/" + link.code}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copy("/" + link.code);
                      }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </td>

                {/* TARGET URL (truncate on small screens) */}
                <td className="p-4 max-w-[160px] sm:max-w-[250px] truncate relative">
                  {link.targetUrl}

                  <div
                    className="absolute left-0 top-full mt-1 hidden group-hover:flex 
                  items-center gap-2 bg-black text-white px-3 py-2 rounded-xl text-sm
                  z-50 shadow-xl"
                  >
                    <span className="max-w-[250px] break-all">{link.targetUrl}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copy(link.targetUrl);
                      }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </td>

                <td className="p-4">{link.clicks}</td>

                <td className="p-4">
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>

                {/* DELETE BUTTON */}
                <td className="p-4 flex gap-2">
                  <button
                         onClick={async (e) => {
                            e.stopPropagation();
              try {
                await api.delete(`/links/${link.code}`);
                toast.success("Link deleted");
                 fetchLinks();
              } catch (e) {
                toast.error("Failed to delete link");
              }
            }}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition text-red-500
                              ${dark 
                                ? "bg-[#5b3928] border-[#704c35] hover:bg-[#704c35]" 
                                : "bg-purple-100 border-purple-300 hover:bg-purple-200"
                              }`}
                  >
                    <Trash2 size={20} />
                  </button>

                  {/* OPEN POPUP FOR FULL URL */}
                 <button
                            onClick={(e) =>{
                                e.stopPropagation()
                                navigator.clipboard.writeText(location.origin + "/" + link.code);
                                 toast.success("link copied");
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition
                              ${dark 
                                ? "bg-[#5b3928] border-[#704c35] hover:bg-[#704c35]" 
                                : "bg-purple-100 border-purple-300 hover:bg-purple-200"
                              }`}
                          >
                            <Copy size={18} />
                          </button>

                </td>
      


              </tr>
            ))}
          </tbody>
        </table>
      )}


       {!loading && filtered.length === 0 && (
          <p className="text-center py-6 opacity-70">No links found</p>
        )}

      </div>

      <CreateLinkModal
        open={openModal}
        setOpen={setOpenModal}
        refreshLinks={fetchLinks}
      />
    </div>
  );
}
