require("dotenv").config(); // Load environment variables from .env
const express = require("express"); // Express.js framework
const cors = require("cors"); // Middleware to allow cross-origin requests
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For authentication
const { PrismaClient } = require("@prisma/client"); // Prisma ORM for database access

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Secret key for JWT authentication
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ REGISTER ADMIN (Only run once to create an admin)
app.post("/admin/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({ where: { username } });
  if (existingAdmin) {
    return res.status(400).json({ error: "Admin already exists" });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save admin user in the database
  await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  res.json({ message: "Admin registered successfully!" });
});

// ✅ LOGIN ADMIN
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  // Find admin in database
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "24h" });

  res.json({ token });
});

// ✅ JWT MIDDLEWARE (Protects Admin Routes)
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ PROTECTED ADMIN DASHBOARD ROUTE
app.get("/admin/dashboard", authenticateAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});

// ✅ GET ALL PLAYERS
app.get("/players", async (req, res) => {
  const players = await prisma.player.findMany({
    include: { currentRuns: true, pastNoHitRuns: true, guides: true },
  });
  res.json(players);
});

// ✅ GET SINGLE PLAYER
app.get("/players/:name", async (req, res) => {
  const player = await prisma.player.findUnique({
    where: { name: req.params.name },
    include: { currentRuns: true, pastNoHitRuns: true, guides: true },
  });

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player);
});

// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Hitless Stats API is running!");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});