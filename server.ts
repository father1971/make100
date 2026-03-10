import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simple file-based database for leaderboard
const DB_FILE = path.join(process.cwd(), "scores.json");

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Helper to read scores
const getScores = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper to write scores
const saveScores = (scores: any[]) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(scores, null, 2));
};

// API: Get top 50 scores
app.get("/api/leaderboard", (req, res) => {
  const scores = getScores();
  // Sort descending by score
  scores.sort((a: any, b: any) => b.score - a.score);
  res.json(scores.slice(0, 50));
});

// API: Submit a new score
app.post("/api/leaderboard", (req, res) => {
  const { userId, name, score, photoUrl } = req.body;
  
  if (!userId || !name || typeof score !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const scores = getScores();
  
  // Check if user already exists
  const existingIndex = scores.findIndex((s: any) => s.userId === userId);
  
  if (existingIndex !== -1) {
    // Update score if it's higher
    if (score > scores[existingIndex].score) {
      scores[existingIndex].score = score;
      scores[existingIndex].name = name; // Update name in case it changed
      if (photoUrl) scores[existingIndex].photoUrl = photoUrl;
    }
  } else {
    // Add new user
    scores.push({ userId, name, score, photoUrl, date: new Date().toISOString() });
  }

  saveScores(scores);
  res.json({ success: true });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.join(process.cwd(), "dist")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
