import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";

import commentRoutes from "./routes/commentRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import captchaRoutes from "./routes/captchaRoutes.js";
import { setupSwagger } from "./swagger.js";

const app = express();

/* ===============================
   FIX __dirname
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   SECURITY
================================ */
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ===============================
   ENV-SAFE CORS
================================ */
const normalizeOrigin = (origin) =>
  origin?.replace(/\/$/, "");

const allowedOrigins = [
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) =>
        normalizeOrigin(o.trim())
      )
    : []),
  normalizeOrigin(process.env.BASE_URL),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalized = normalizeOrigin(origin);

      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

/* ===============================
   BODY PARSER
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   STATIC FILES
================================ */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

/* ===============================
   HEALTHCHECK
================================ */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ===============================
   ROUTES
================================ */
app.use("/captcha", captchaRoutes);
app.use("/comments", commentRoutes);
app.use("/files", fileRoutes);
app.use("/users", userRoutes);

/* ===============================
   SWAGGER
================================ */
setupSwagger(app);

/* ===============================
   404
================================ */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? statusCode === 500
          ? "Internal Server Error"
          : err.message
        : err.message,
  });
});

export default app;