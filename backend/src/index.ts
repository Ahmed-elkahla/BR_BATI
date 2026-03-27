import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import dataRoutes from "./routes/data.routes";

const app = express();
const PORT = process.env.PORT ?? 4000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL ?? "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api",      dataRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
