const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const prisma = new PrismaClient();

const authenticateAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // ✅ Ensure adminId exists
        if (!decoded.adminId) {
            return res.status(403).json({ error: "Invalid token: Missing adminId." });
        }

        // ✅ Fetch full admin details
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
            select: { id: true, username: true, role: true, permittedPlayers: true, password: true }
        });

        if (!admin) {
            return res.status(403).json({ error: "Invalid token: Admin not found" });
        }

        console.log("🔹 Raw permittedPlayers from DB:", admin.permittedPlayers);

        // ✅ Ensure permittedPlayers is always an array
        if (!admin.permittedPlayers) {
            admin.permittedPlayers = []; // Default to empty array if NULL
        } else if (typeof admin.permittedPlayers === "string") {
            try {
                admin.permittedPlayers = JSON.parse(admin.permittedPlayers);
                if (!Array.isArray(admin.permittedPlayers)) {
                    throw new Error("Parsed value is not an array"); // Catch incorrectly formatted data
                }
            } catch (error) {
                console.error("❌ Failed to parse permittedPlayers JSON:", error);
                admin.permittedPlayers = []; // Set to empty array on failure
            }
        } else if (!Array.isArray(admin.permittedPlayers)) {
            admin.permittedPlayers = []; // Default to empty array if invalid type
        }

        console.log("✅ Final permittedPlayers:", admin.permittedPlayers);

        // ✅ Check if the password has changed
        if (decoded.passwordHash && decoded.passwordHash !== admin.password) {
            console.log("🔄 Password changed. Forcing new session...");
            
            // Generate a new token with the updated password hash
            const newToken = jwt.sign(
                { 
                    adminId: admin.id,
                    username: admin.username,
                    role: admin.role,
                    permittedPlayers: admin.permittedPlayers,
                    passwordHash: admin.password // Update token with new hash
                },
                JWT_SECRET,
                { expiresIn: "24h" }
            );
        
            return res.json({ message: "Password updated successfully! Please log in again.", newToken });
        }

        req.admin = admin; // Attach full admin data to request
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { authenticateAdmin };