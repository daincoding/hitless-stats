const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const prisma = new PrismaClient();

const authenticateAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // ✅ Fetch the full admin details from the database
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
            select: { id: true, username: true, role: true, permittedPlayers: true }
        });

        if (!admin) {
            return res.status(403).json({ error: "Invalid token: Admin not found" });
        }

        console.log("🔹 Raw permittedPlayers from DB:", admin.permittedPlayers);

        // ✅ Ensure permittedPlayers is always an array
        if (typeof admin.permittedPlayers === "string") {
            try {
                admin.permittedPlayers = JSON.parse(admin.permittedPlayers);
            } catch (error) {
                console.error("❌ Failed to parse permittedPlayers JSON:", error);
                admin.permittedPlayers = []; // Set to empty array on failure
            }
        } else if (!Array.isArray(admin.permittedPlayers)) {
            admin.permittedPlayers = []; // Default to empty array if not already
        }

        console.log("✅ Parsed permittedPlayers:", admin.permittedPlayers);

        req.admin = admin; // Attach full admin data to request
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { authenticateAdmin };