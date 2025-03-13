const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { authenticateAdmin } = require("../middleware/authMiddleware"); // Protect routes

const router = express.Router();
const prisma = new PrismaClient();

/** 
 * 🔹 Change Password
 */

router.put("/change-password", authenticateAdmin, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        // ✅ Ensure the admin is authenticated
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id },
        });

        if (!admin) {
            return res.status(403).json({ error: "Admin not found." });
        }

        // ✅ Check if the current password matches the stored hash
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect." });
        }

        // ✅ Ensure new passwords match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "New passwords do not match." });
        }

        // ✅ Hash and update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword },
        });

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("❌ Error changing password:", error);
        res.status(500).json({ error: "Failed to change password." });
    }
});

/** 
 * 🔹 GET CURRENT ADMIN INFO (Used for Role-based Access)
 */
router.get("/me", authenticateAdmin, async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id },
            select: { username: true, role: true, permittedPlayers: true }, // Send relevant data only
        });

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json(admin);
    } catch (error) {
        console.error("❌ Error fetching admin info:", error);
        res.status(500).json({ error: "Failed to fetch admin info" });
    }
});

/** 
 * 🔹 GET ALL EDITORS (Superadmin Only) 
 */
router.get("/list-editors", authenticateAdmin, async (req, res) => {
    try {
        // Ensure only Superadmins can view editors
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can view editors." });
        }

        const editors = await prisma.admin.findMany({
            where: { role: "editor" },
            select: { username: true, permittedPlayers: true },
        });

        res.json(editors);
    } catch (error) {
        console.error("❌ Error fetching editors:", error);
        res.status(500).json({ error: "Failed to fetch editor list." });
    }
});

/** 
 * 🔹 UPDATE EDITOR PERMISSIONS (Superadmin Only)
 */
router.put("/update-editor/:username", authenticateAdmin, async (req, res) => {
    const { password, permittedPlayers } = req.body;

    try {
        // ✅ Ensure only superadmins can update editors
        const requestingAdmin = await prisma.admin.findUnique({
            where: { username: req.admin.username },
        });
        if (!requestingAdmin || requestingAdmin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can update editors." });
        }

        // ✅ Prepare update data (Only hash password if provided)
        let updateData = {
            permittedPlayers: Array.isArray(permittedPlayers) ? permittedPlayers : [],
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // ✅ Update the editor
        const updatedEditor = await prisma.admin.update({
            where: { username: req.params.username },
            data: updateData,
        });

        res.json({ message: "Editor updated successfully!", admin: updatedEditor });

    } catch (error) {
        console.error("❌ Error updating editor:", error);
        res.status(500).json({ error: "Failed to update editor." });
    }
});

/** 
 * 🔹 CREATE A NEW EDITOR (Superadmin Only)
 */
router.post("/create-editor", authenticateAdmin, async (req, res) => {
    try {
        // Ensure only Superadmins can create editors
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can create editors." });
        }

        const { username, password, permittedPlayers } = req.body;

        // Check if editor username already exists
        const existingEditor = await prisma.admin.findUnique({ where: { username } });
        if (existingEditor) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new editor
        const newEditor = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                role: "editor", // Always set role as "editor"
                permittedPlayers: JSON.stringify(permittedPlayers || []),
            },
        });

        res.json({ message: "Editor created successfully!", admin: newEditor });
    } catch (error) {
        console.error("❌ Error creating editor:", error);
        res.status(500).json({ error: "Failed to create editor." });
    }
});

/** 
 * 🔹 DELETE AN EDITOR (Superadmin Only)
 */
router.delete("/delete-editor/:username", authenticateAdmin, async (req, res) => {
    try {
        // Ensure only Superadmins can delete editors
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can delete editors." });
        }

        const { username } = req.params;

        // Ensure the editor exists before attempting deletion
        const editor = await prisma.admin.findUnique({ where: { username } });
        if (!editor) {
            return res.status(404).json({ error: "Editor not found" });
        }

        // Prevent deleting superadmins
        if (editor.role === "superadmin") {
            return res.status(403).json({ error: "Cannot delete a superadmin." });
        }

        // Delete the editor
        await prisma.admin.delete({ where: { username } });

        res.json({ message: "Editor deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting editor:", error);
        res.status(500).json({ error: "Failed to delete editor." });
    }
});

/** 
 * 🔹 CREATE A NEW ADMIN ACCOUNT (Superadmin Only) 
 */
router.post("/create-admin", authenticateAdmin, async (req, res) => {
    const { username, password, role, permittedPlayers } = req.body;
    
    try {
        // Ensure only Superadmins can create new admins
        const requestingAdmin = await prisma.admin.findUnique({ where: { id: req.admin.adminId } });
        if (!requestingAdmin || requestingAdmin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can create accounts." });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new admin user
        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                role: role || "editor", // Default to "editor" if not specified
                permittedPlayers: permittedPlayers ? JSON.stringify(permittedPlayers) : "[]",
            },
        });

        res.json({ message: "Admin created successfully!", admin: newAdmin });

    } catch (error) {
        console.error("❌ Error creating admin:", error);
        res.status(500).json({ error: "Failed to create admin." });
    }
});

/** 
 * 🔹 UPDATE ADMIN PERMISSIONS (Superadmin Only) 
 */
router.put("/update-admin/:username", authenticateAdmin, async (req, res) => {
    const { role, permittedPlayers } = req.body;
    
    try {
        // Ensure only Superadmins can update permissions
        const requestingAdmin = await prisma.admin.findUnique({ where: { id: req.admin.adminId } });
        if (!requestingAdmin || requestingAdmin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can update permissions." });
        }

        // Update admin details
        const updatedAdmin = await prisma.admin.update({
            where: { username: req.params.username },
            data: {
                role,
                permittedPlayers: JSON.stringify(permittedPlayers),
            },
        });

        res.json({ message: "Admin updated successfully!", admin: updatedAdmin });

    } catch (error) {
        console.error("❌ Error updating admin:", error);
        res.status(500).json({ error: "Failed to update admin." });
    }
});

/** 
 * 🔹 DELETE AN ADMIN ACCOUNT (Superadmin Only) 
 */
router.delete("/delete-admin/:username", authenticateAdmin, async (req, res) => {
    try {
        // Ensure only Superadmins can delete accounts
        const requestingAdmin = await prisma.admin.findUnique({ where: { id: req.admin.adminId } });
        if (!requestingAdmin || requestingAdmin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can delete accounts." });
        }

        await prisma.admin.delete({ where: { username: req.params.username } });
        res.json({ message: "Admin deleted successfully!" });

    } catch (error) {
        console.error("❌ Error deleting admin:", error);
        res.status(500).json({ error: "Failed to delete admin." });
    }
});

/** 
 * 🔹 GET ALL ADMINS (Superadmin Only) 
 */
router.get("/list-admins", authenticateAdmin, async (req, res) => {
    try {
        // Ensure only Superadmins can view all admins
        const requestingAdmin = await prisma.admin.findUnique({ where: { id: req.admin.adminId } });
        if (!requestingAdmin || requestingAdmin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can view admin accounts." });
        }

        const admins = await prisma.admin.findMany({
            select: { id: true, username: true, role: true, permittedPlayers: true },
        });

        res.json(admins);

    } catch (error) {
        console.error("❌ Error fetching admins:", error);
        res.status(500).json({ error: "Failed to fetch admin list." });
    }
});

/** 
 * 🔹 CREATE A NEW PLAYER (Admins Allowed)
 */
router.post("/players", authenticateAdmin, async (req, res) => {
    try {
        // Restrict editors to only create players assigned to them
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can create players." });
        }

        const newPlayer = await prisma.player.create({
            data: req.body,
        });

        res.json(newPlayer);

    } catch (error) {
        console.error("❌ Error creating player:", error);
        res.status(500).json({ error: "Failed to create player." });
    }
});

/** 
 * 🔹 UPDATE PLAYER INFO (Restricted for Editors) 
 */
router.put("/players/:name", authenticateAdmin, async (req, res) => {
    try {
        console.log("🔹 Update Request Received for Player:", req.params.name);

        if (req.admin.role !== "superadmin") {
            let allowedPlayers = req.admin.permittedPlayers;
        
            // ✅ Ensure permittedPlayers is properly parsed
            if (typeof allowedPlayers === "string") {
                try {
                    allowedPlayers = JSON.parse(allowedPlayers); // ✅ Convert JSON string to array
                } catch (error) {
                    console.error("❌ Failed to parse permittedPlayers:", error);
                    return res.status(500).json({ error: "Invalid permittedPlayers format." });
                }
            }
        
            console.log("🔹 Parsed Allowed Players:", allowedPlayers);
        
            if (!Array.isArray(allowedPlayers) || !allowedPlayers.includes(req.params.name)) {
                return res.status(403).json({ error: "Unauthorized: You are not allowed to edit this player." });
            }
        }

        const updatedPlayer = await prisma.player.update({
            where: { name: req.params.name },
            data: req.body,
        });

        console.log("✅ Player Updated Successfully:", updatedPlayer);
        res.json(updatedPlayer);

    } catch (error) {
        console.error("❌ Error updating player:", error);
        res.status(500).json({ error: "Failed to update player." });
    }
});

/** 
 * 🔹 DELETE A PLAYER (Superadmin Only) 
 */
router.delete("/players/:name", authenticateAdmin, async (req, res) => {
    try {
        console.log("🔹 Delete Request Received for Player:", req.params.name);

        // Restrict editors from deleting players
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({ error: "Unauthorized: Only Superadmins can delete players." });
        }

        await prisma.player.delete({
            where: { name: req.params.name },
        });

        console.log("✅ Player Deleted Successfully");
        res.json({ message: "Player deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting player:", error);
        res.status(500).json({ error: "Failed to delete player." });
    }
});

/** 
 * 🔹 GET ALL PLAYERS (Superadmins see all, Editors see only permitted ones)
 */
router.get("/players", authenticateAdmin, async (req, res) => {
    try {
        console.log("🔍 GET /players route hit! Checking admin permissions...");
        console.log("🔹 Admin Role:", req.admin.role);
        console.log("🔹 Permitted Players (Raw):", req.admin.permittedPlayers);

        // ✅ Superadmins see all players
        if (req.admin.role === "superadmin") {
            console.log("✅ Superadmin detected, returning all players.");
            const allPlayers = await prisma.player.findMany({
                include: { currentRuns: true, pastNoHitRuns: true, guides: true },
            });
            return res.json(allPlayers);
        }

        // ✅ Editors should only see permitted players
        if (req.admin.role === "editor") {
            let allowedPlayers = req.admin.permittedPlayers;

            // ✅ Ensure `permittedPlayers` is properly parsed (if stored as JSON)
            if (!Array.isArray(allowedPlayers)) {
                console.error("❌ permittedPlayers is NOT an array:", allowedPlayers);
                return res.status(500).json({ error: "Invalid permittedPlayers format." });
            }

            console.log("✅ Fetching only allowed players:", allowedPlayers);
            const filteredPlayers = await prisma.player.findMany({
                where: { name: { in: allowedPlayers } }, // Only fetch assigned players
                include: { currentRuns: true, pastNoHitRuns: true, guides: true },
            });

            console.log("✅ Players returned:", filteredPlayers.map(p => p.name));
            return res.json(filteredPlayers);
        }

        // ❌ If the role is not recognized, return unauthorized
        console.log("❌ Unauthorized access attempt.");
        return res.status(403).json({ error: "Unauthorized" });

    } catch (error) {
        console.error("❌ Error fetching players:", error);
        res.status(500).json({ error: "Failed to fetch players." });
    }
});

module.exports = router;