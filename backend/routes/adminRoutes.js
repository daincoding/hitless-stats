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
 * 🔹 UPDATE PLAYER INFO (By Name)
 */
router.put("/players/:name", authenticateAdmin, async (req, res) => {
    try {
        console.log("🔹 Update Request Received for Player:", req.params.name); // Debugging Log

        const updatedPlayer = await prisma.player.update({
            where: { name: req.params.name }, // Find by name
            data: req.body,
        });

        console.log("✅ Player Updated Successfully:", updatedPlayer); // Debugging Log
        res.json(updatedPlayer);
    } catch (error) {
        console.error("❌ Error updating player:", error); // Log the full error
        res.status(500).json({ error: "Failed to update player" });
    }
});

/**
 * 🔹 DELETE A PLAYER (By Name)
 */
router.delete("/players/:name", authenticateAdmin, async (req, res) => {
    try {
        console.log("🔹 Delete Request Received for Player:", req.params.name); // Debugging Log

        await prisma.player.delete({
            where: { name: req.params.name }, // Find by name
        });

        console.log("✅ Player Deleted Successfully"); // Debugging Log
        res.json({ message: "Player deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting player:", error);
        res.status(500).json({ error: "Failed to delete player" });
    }
});

module.exports = router;