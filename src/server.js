import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import albumRoutes from "./routes/albumRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/albums", albumRoutes);
app.get("/", (req, res) => {
  res.send("Enzert API Running");
});
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
