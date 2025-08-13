import express from "express";
import cors from "cors";
import helmet from "helmet";
import signatureRoutes from "./routes/signature";
import "dotenv/config";

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: "GET,HEAD,POST,OPTIONS",
  credentials: true,
}));
app.use(helmet()); // Adds security headers
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/", signatureRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
