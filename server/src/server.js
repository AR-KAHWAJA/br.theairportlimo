import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import { createRateLimiter, requireSubmissionsToken } from "./middleware/security.js";
import healthRoutes from "./routes/health.js";
import leadRoutes from "./routes/leads.js";

dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT || 5174;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
const staticBasePaths = new Set(
  [process.env.PUBLIC_BASE_PATH, "/br.theairportlimo"]
    .map((basePath) => normalizeBasePath(basePath || ""))
    .filter((basePath) => basePath !== "/")
);
const defaultOrigins = ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5174"];
const allowedOrigins = new Set(
  [...defaultOrigins, ...(process.env.CLIENT_ORIGIN || "").split(",")]
    .join(",")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many API requests. Please try again soon."
});
const leadLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many form submissions. Please wait a few minutes and try again."
});

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function resolveCorsOrigin(origin, callback) {
  if (!origin || allowedOrigins.has(origin)) {
    return callback(null, true);
  }

  return callback(null, false);
}

function setStaticCacheHeaders(res, filePath) {
  if (filePath.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }

  if (filePath.endsWith(".css")) {
    res.setHeader("Cache-Control", "public, max-age=3600");
    return;
  }

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader("Cache-Control", "public, max-age=604800");
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=3600");
}

await connectDB();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-origin" },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "connect-src": ["'self'"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "frame-ancestors": ["'none'"],
        "img-src": ["'self'", "data:", "blob:"],
        "object-src": ["'none'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"]
      }
    }
  })
);
app.use(compression());
app.use(express.json({ limit: "64kb", strict: true }));
app.use(
  cors({
    origin: resolveCorsOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Submissions-Token"],
    credentials: false,
    maxAge: 86400
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/health", healthRoutes);
app.use("/api", apiLimiter);
app.use(["/api/inquiries", "/api/reservations", "/api/app-interest"], leadLimiter);
app.use("/api/submissions", requireSubmissionsToken);
app.use("/api", leadRoutes);

app.use(express.static(clientDist, { dotfiles: "ignore", etag: true, setHeaders: setStaticCacheHeaders }));
for (const basePath of staticBasePaths) {
  app.use(basePath, express.static(clientDist, { dotfiles: "ignore", etag: true, setHeaders: setStaticCacheHeaders }));
}
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-cache");
    return res.sendFile(path.join(clientDist, "index.html"));
  }

  return next();
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ ok: false, message: "Something went wrong." });
});

app.listen(port, () => {
  console.log(`BlinkRide API listening on http://localhost:${port}`);
});
