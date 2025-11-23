import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoute.js";
import linkRoutes from "./routes/linkRoute.js";
import analyticsRoutes from "./routes/analyticsRoute.js";
import redirectRoutes from "./routes/redirectRoute.js";
import healthRoutes from "./routes/healthRoute.js";

import { createLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";


const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(createLimiter);
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/redirect", redirectRoutes);
app.use("/healthz", healthRoutes);

// last error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => 
    console.log('Server running on', PORT)
);
