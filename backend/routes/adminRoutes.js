const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateAdmin } = require("../middleware/authMiddleware"); // Protects routes

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 🔹 CREATE A NEW PLAYER
 */
router.post("/players", authenticateAdmin, async (req, res) => {
    try {
        const newPlayer = await prisma.player.create({
            data: req.body, // Send player data from frontend
        });
        res.json(newPlayer);
    } catch (error) {
        res.status(500).json({ error: "Failed to create player" });
    }
});

/**
 * 🔹 UPDATE PLAYER INFO
 */
router.put("/players/:id", authenticateAdmin, async (req, res) => {
    try {
        const updatedPlayer = await prisma.player.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ error: "Failed to update player" });
    }
});

/**
 * 🔹 DELETE A PLAYER
 */
router.delete("/players/:id", authenticateAdmin, async (req, res) => {
    try {
        await prisma.player.delete({ where: { id: req.params.id } });
        res.json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete player" });
    }
});

module.exports = router;