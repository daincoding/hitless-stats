require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Get All Players
app.get("/players", async (req, res) => {
  const players = await prisma.player.findMany({ include: { currentRuns: true, pastNoHitRuns: true, guides: true } });
  res.json(players);
});

// Get a Single Player
app.get("/players/:name", async (req, res) => {
  const player = await prisma.player.findUnique({
    where: { name: req.params.name },
    include: { currentRuns: true, pastNoHitRuns: true, guides: true }
  });

  console.log("Fetched Player Data:", player); // Debugging Log
  console.log("Current Runs:", player ? player.currentRuns : "No runs found");

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player);
});

// Start Server
const PORT = process.env.PORT || 5001;

// Middleware (If needed)
app.use(express.json());

// Example API Route (Adjust this based on your API)
app.get("/api/players", (req, res) => {
  res.json({ message: "Players API is working!" });
});

// Fix: Add a Default Route for "/"
app.get("/", (req, res) => {
  res.send("Hitless Stats API is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
