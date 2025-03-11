const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; 

// 🔹 Admin Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        const admin = await prisma.admin.findUnique({ where: { username } });
        if (!admin) return res.status(401).json({ error: "Invalid credentials" });

        // Compare the password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ adminId: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "2h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// 🔹 Register a New Admin (Only for development - Remove in Production!)
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingAdmin = await prisma.admin.findUnique({ where: { username } });
        if (existingAdmin) return res.status(400).json({ error: "Username already taken" });

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newAdmin = await prisma.admin.create({
            data: { username, password: hashedPassword },
        });

        res.json({ message: "Admin registered successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ error: "Failed to create admin" });
    }
});

module.exports = router;