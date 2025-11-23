import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from "/logo1.jfif";
import { toast } from "react-toastify";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const dark = theme === "dark";

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("logged out")
    navigate("/login");
  };

  return (
    <nav
      className={`w-full px-6 py-4 shadow-md flex justify-between items-center fixed top-0 left-0 z-40 transition-all duration-300
      ${
        dark
          ? "bg-[#2b1a12] text-white border-b border-[#5a3827]"
          : "bg-white text-gray-900 border-b border-purple-300"
      }`}
    >
      {/* BRAND */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 rounded-xl shadow-md object-cover"
        />
        <h1 className="text-2xl font-extrabold tracking-wide">tinyURL</h1>
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* NAV LINKS */}
      <div
        className={`
          flex-col md:flex-row md:flex gap-6 absolute md:static 
          left-0 w-full md:w-auto px-6 md:px-0 py-4 md:py-0
          rounded-xl shadow-md md:shadow-none transition-all duration-300
          ${
            isMenuOpen
              ? "top-16 opacity-100"
              : "top-[-450px] opacity-0 md:opacity-100"
          }
          ${
            dark
              ? "bg-[#3a2418] border border-[#5a3827]"
              : "bg-white border border-purple-200"
          }
        `}
      >
          {/* PORTFOLIO */}
<a
  href="https://portfolio-vikash-sinhas-projects.vercel.app/"
  target="_blank"
  className={`block md:inline text-lg font-medium rounded-lg px-4 py-2 transition border
    ${
      dark
        ? "border-[#7a5238] text-white hover:bg-[#5b3928]"
        : "border-purple-300 text-gray-900 hover:bg-purple-100"
    }
  `}
>
  Portfolio
</a>

{/* GITHUB */}
<a
  href="https://github.com/vikash000x"
  target="_blank"
  className={`block md:inline text-lg font-medium rounded-lg px-4 py-2 transition border
    ${
      dark
        ? "border-[#7a5238] text-white hover:bg-[#5b3928]"
        : "border-purple-300 text-gray-900 hover:bg-purple-100"
    }
  `}
>
  GitHub
</a>

        {/* If NOT logged in */}
        {!isLoggedIn && (
          <>
            <Link
              to="/signup"
              className={`block md:inline text-lg font-medium rounded-lg px-4 py-2 transition
                ${
                  dark
                    ? "hover:bg-[#5b3928]"
                    : "hover:bg-purple-100 text-gray-900"
                }`}
            >
              Signup
            </Link>

            <Link
              to="/login"
              className={`block md:inline text-lg font-medium rounded-lg px-4 py-2 transition
                ${
                  dark
                    ? "hover:bg-[#5b3928]"
                    : "hover:bg-purple-100 text-gray-900"
                }`}
            >
              Login
            </Link>
          </>
        )}

        {/* If LOGGED IN */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className={`block md:inline text-lg font-medium px-4 py-2 rounded-lg transition
            ${
              dark
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Logout
          </button>
        )}

        {/* THEME BUTTON */}
        <button
          onClick={toggle}
          className={`mt-3 md:mt-0 px-4 py-2 font-medium rounded-lg border transition
          ${
            dark
              ? "border-[#7a5238] bg-[#5b3928] text-white hover:bg-[#704c35]"
              : "border-purple-300 bg-purple-100 text-gray-900 hover:bg-purple-200"
          }`}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
