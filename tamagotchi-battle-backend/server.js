import "dotenv/config";
import express from "express";
import cors from "cors";
import tamagotchiRouter from "./routes/tamagotchi.js";
import battleRouter from "./routes/battle.js";

import authRouter from "./routes/auth.js";

const app = express();
const PORT = 8000;

// Middleware segment - allows frontend to call backend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Tamagotchi Battle API is running!" });
});

// API Routes
app.use("/auth", authRouter);

app.use("/tamagotchi", tamagotchiRouter);

app.use("/battle", battleRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
