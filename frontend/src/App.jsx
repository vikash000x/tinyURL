import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import Login from './pages/Login.jsx'
import Forgot from './pages/Forgot.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useTheme } from './context/ThemeContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import RedirectPage from './pages/RedirectPage.jsx'
import StatsPage from './pages/StatePage.jsx'
import HealthCheck from './pages/HealthCheck.jsx'

// Wrapper so we can use useLocation
function AppWrapper() {
  const location = useLocation();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Hide navbar when:
  // 1. User visits redirect page /:code
  // 2. On 404 page
  const hideNavbar =
    location.pathname.startsWith("/code/") === false &&
    /^\/[^/]+$/.test(location.pathname) &&
    !["/signup","/login","/forgot","/reset","/verify"].includes(location.pathname);

  const is404 = location.pathname === "/404";

  return (
    <div
      className={`min-h-screen w-full flex flex-col ${
        dark
          ? "bg-[#2b1a12] text-white"
          : "bg-white text-gray-900"
      }`}
    >

      {/* SHOW NAVBAR ONLY WHEN NOT IN REDIRECT PAGE OR 404 */}
      {!hideNavbar && !is404 && <Navbar />}

      <main className="py-6 pt-16">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* redirect */}
          <Route path="/:code" element={<RedirectPage />} />

          {/* stats */}
          <Route path="/code/:code" element={<StatsPage />} />

          <Route path="/healthz" element={<HealthCheck />} />

          {/* dashboard */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* custom 404 */}
          <Route path="/404" element={<div className="text-center text-xl mt-40 ">URL Not Found</div>} />

          {/* fallback */}
          <Route path="*" element={<div className="text-center text-xl mt-40">URL Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
