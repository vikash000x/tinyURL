import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<ThemeProvider>
<App />
<ToastContainer position="top-right" />
</ThemeProvider>
</React.StrictMode>
)