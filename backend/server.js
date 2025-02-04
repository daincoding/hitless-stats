require("dotenv").config(); // Loads environment variables from a .env file
const express = require("express"); // Imports Express.js framework - The framework used to create the API.
const cors = require("cors"); // Imports CORS middleware to handle cross-origin requests - Middleware that allows the frontend (React) to make API requests to the backend.
const { PrismaClient } = require("@prisma/client"); // Imports Prisma client for database access - Database client for interacting with the SQLite database.

const app = express(); // Creates the Express server.
const prisma = new PrismaClient(); // → Creates an instance of Prisma to interact with the database.

app.use(express.json()); // Enables JSON parsing in incoming requests - Automatically parses JSON data in incoming requests.
app.use(cors()); // Enables CORS to allow cross-origin requests


// Get All Players
app.get("/players", async (req, res) => { // Handles GET requests to /players Async function because it fetches data from the database.
  const players = await prisma.player.findMany({ include: { currentRuns: true, pastNoHitRuns: true, guides: true } }); // prisma.player.findMany() → Fetches all players from the database.
  res.json(players); // Sends the retrieved data as JSON back to the frontend.
});

// Get a Single Player
app.get("/players/:name", async (req, res) => {
  const player = await prisma.player.findUnique({
    where: { name: req.params.name }, // Looks up a player by name in the database.
    include: { currentRuns: true, pastNoHitRuns: true, guides: true }
  });

  console.log("Fetched Player Data:", player); // Debugging Log
  console.log("Current Runs:", player ? player.currentRuns : "No runs found");

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player); // Sends the player object as JSON back to the frontend.
});

// Start Server
const PORT = process.env.PORT || 5001; // Retrieves the PORT from environment variables (if set), otherwise defaults to 5001.

// Middleware (If needed)
app.use(express.json()); // Already defined earlier, but ensures all routes can parse JSON requests.

// Example API Route (Adjust this based on your API)
app.get("/api/players", (req, res) => {
  res.json({ message: "Players API is working!" }); // Returns { message: "Players API is working!" } when accessed at /api/players.
});

// Fix: Add a Default Route for "/"
app.get("/", (req, res) => {
  res.send("Hitless Stats API is running!"); // Sends back a simple response "Hitless Stats API is running!".
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`); // Starts the Express server on the specified PORT.
});
