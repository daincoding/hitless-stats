const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { authenticateAdmin } = require("../middleware/authMiddleware"); // Protect routes

const router = express.Router();
const prisma = new PrismaClient();

/** 
 * 🔹 Get All Marathon Runs
 */

router.get("/runs/marathon/:player", authenticateAdmin, async (req, res) => {
    const { player } = req.params;
    console.log("🔍 API Request for Marathon Runs - Player:", player);

    try {
        // ✅ Step 1: Ensure Player Exists
        const playerData = await prisma.player.findUnique({
            where: { name: player },
            select: { id: true, name: true }
        });

        if (!playerData) {
            console.log("❌ ERROR: Player Not Found in DB:", player);
            return res.status(404).json({ error: "Player not found" });
        }

        console.log(`✅ Found Player: ${playerData.name} (ID: ${playerData.id})`);

        // ✅ Step 2: Fetch Marathon Runs using playerId
        console.log(`🔹 Fetching Marathon Runs for Player: "${playerData.name}", ID: ${playerData.id}`);
        const marathonRuns = await prisma.run.findMany({
            where: {
                type: "Marathon",
                playerId: playerData.id, // ✅ Ensure correct playerId
            },
            select: {
                id: true,
                name: true,
                type: true,
                startDate: true,
                description: true, // 📝 Description of the run
                badges: true, // 🏅 Any special badges
                status: true, // 🔄 Status (Alive/Dead)
                worldRecord: true, // 🏆 If it's a WR run
                distancePB: true, // 📊 Best distance achieved
                splits: true, // ✅ List of splits
                completedSplits: true, // ✅ How many splits completed
                failedSplit: true, // ❌ Where the run failed (if applicable)
                currentOrder: true, // 🔄 Order of games in Marathon
                games: true, // 🎮 List of games in the Marathon
                pastRuns: true, // 📜 JSON data of past runs
                playerId: true, // 🔗 To verify the player
            }
        });

        // ✅ Step 3: Check Results
        if (!marathonRuns.length) {
            console.log(`⚠ No Marathon Runs Found for Player: ${playerData.name}`);
            return res.status(404).json({ error: "No marathon runs found" });
        }

        console.log(`✅ Found ${marathonRuns.length} Marathon Runs`);
        res.json(marathonRuns);
    } catch (error) {
        console.error("❌ ERROR Fetching Marathon Runs:", error);
        res.status(500).json({ error: "Failed to fetch Marathon Runs" });
    }
});

/** 
 * 🔹 CCreate Marathon
 */
router.post("/runs/create/marathon", authenticateAdmin, async (req, res) => {
    try {
        const { name, description, badges, worldRecord, games, player } = req.body;

        // ✅ Ensure required fields are present
        if (!name || !player || !Array.isArray(games) || games.length === 0) {
            return res.status(400).json({ error: "Missing required fields: Name, Player, or Games" });
        }

        // ✅ Ensure each game has at least 3 splits
        for (const game of games) {
            if (!game.name || !Array.isArray(game.splits) || game.splits.length < 3) {
                return res.status(400).json({ error: `Game '${game.name || "Unnamed"}' must have at least 3 splits` });
            }
        }

        // ✅ Find the player in the database
        const playerData = await prisma.player.findUnique({
            where: { name: player },
        });

        if (!playerData) {
            return res.status(404).json({ error: "Player not found" });
        }

        // ✅ Create the new Marathon Run
        const newRun = await prisma.run.create({
            data: {
                name,
                type: "Marathon",
                startDate: new Date(),
                description,
                badges,
                worldRecord,
                games,  // ✅ Saves the games array correctly
                status: "Alive",
                pastRuns: [],
                player: {
                    connect: { name: player }, // ✅ Link to player
                },
            },
        });

        console.log("✅ New Marathon Run Created:", newRun);
        res.status(201).json(newRun);
    } catch (error) {
        console.error("❌ Error creating marathon run:", error);
        res.status(500).json({ error: "Failed to create marathon run." });
    }
});


/** 
 * 🔹 Edit Marathon
 */
router.put("/runs/:runId", authenticateAdmin, async (req, res) => {
    const { runId } = req.params;
    const { name, description, badges, worldRecord, games } = req.body;

    try {
        console.log(`🔄 Updating Marathon Run ID: ${runId}`);

        const existingRun = await prisma.run.findUnique({ where: { id: runId } });

        if (!existingRun) {
            return res.status(404).json({ error: "Run not found" });
        }

        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: { name, description, badges, worldRecord, games },
        });

        console.log("✅ Marathon Run updated successfully:", updatedRun);
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error updating run:", error);
        res.status(500).json({ error: "Failed to update run." });
    }
});

/** 
 * 🔹 Get PAST Marathon Runs
 */
router.get("/runs/past/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;

    try {
        console.log(`📡 Fetching past runs for Marathon Player: ${player}, Run ID: ${runId}`);

        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player } },
            select: { pastRuns: true }
        });

        if (!run) {
            console.log("❌ Run not found");
            return res.status(404).json({ error: "Run not found" });
        }

        console.log("✅ Marathon Past Runs Fetched:", run.pastRuns);
        res.json(run.pastRuns);
    } catch (error) {
        console.error("❌ Error fetching past runs:", error);
        res.status(500).json({ error: "Failed to fetch past runs." });
    }
});

/** 
 * 🔹 Delete Past Marathon
 */
router.delete("/runs/delete-past/:player/:runId/:index", authenticateAdmin, async (req, res) => {
    const { player, runId, index } = req.params;

    try {
        console.log(`🗑️ Attempting to delete past run #${index} for Marathon Run ID: ${runId}`);

        const run = await prisma.run.findFirst({ where: { id: runId, player: { name: player } } });

        if (!run || !run.pastRuns) {
            return res.status(404).json({ error: "Run or past runs not found" });
        }

        run.pastRuns.splice(index, 1); // ✅ Remove the past run at index

        // ✅ Reorder run IDs
        run.pastRuns = run.pastRuns.map((run, i) => ({ ...run, runId: i + 1 }));

        await prisma.run.update({
            where: { id: runId },
            data: { pastRuns: run.pastRuns },
        });

        console.log("✅ Marathon Past Run deleted successfully!");
        res.json({ success: true });
    } catch (error) {
        console.error("❌ Error deleting past marathon run:", error);
        res.status(500).json({ error: "Failed to delete past marathon run." });
    }
});

/** 
 * 🔹 Save Marathon Run (DOES NOT END THE RUN)
 */
router.post("/runs/marathon/add-run/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;
    const { currentOrder, completedSplits, failedSplit, distancePB } = req.body;

    console.log("📥 Received in backend:", { currentOrder, completedSplits, failedSplit, distancePB });

    try {
        console.log(`🔄 Saving run progress for Player: ${player}, Run ID: ${runId}`);

        // Fetch the current Marathon Run (including existing `distancePB`)
        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player }, type: "Marathon" },
            select: { games: true, distancePB: true } // ✅ Fetch existing `distancePB`
        });

        if (!run) {
            console.error("❌ Run not found");
            return res.status(404).json({ error: "Run not found" });
        }

        // ✅ Fix `distancePB`: Convert game name to `Game X` format and store split number (Only update if provided)
        let distancePBFormatted = run.distancePB; // 🔥 Preserve existing distancePB
        if (distancePB) {
            const gameIndex = currentOrder.indexOf(distancePB.game);
            distancePBFormatted = {
                game: `Game ${gameIndex + 1}`,  
                split: String(run.games.find(g => g.name === distancePB.game)?.splits.indexOf(distancePB.split) + 1 || "0"),
            };
        }

        // ✅ Fix `failedSplit`: Ensure correct format
        const failedSplitFormatted = failedSplit
            ? { game: failedSplit.game, split: failedSplit.split }
            : null;

        // ✅ Ensure `completedSplits` is stored correctly
        const completedSplitsFormatted = {};
        currentOrder.forEach(game => {
            completedSplitsFormatted[game] = completedSplits[game] || 0;
        });

        // ✅ Set status based on failedSplit existence
        const runStatus = failedSplit ? "Dead" : "Alive";

        // ✅ Update the current run but DO NOT move to `pastRuns`
        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: {
                currentOrder: currentOrder, 
                completedSplits: completedSplitsFormatted, 
                failedSplit: failedSplitFormatted, 
                distancePB: distancePBFormatted, // 🔥 Only updates if selected
                status: runStatus, // 🔥 Dynamically set status
            },
        });

        console.log(`✅ Run progress saved! Status: ${runStatus}`);
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error saving run:", error);
        res.status(500).json({ error: "Failed to save run." });
    }
});

/** 
 * 🔹 End Marathon Run (MOVE TO PAST RUNS)
 */
router.post("/runs/marathon/end-run/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;
    const { pastRun } = req.body;

    console.log(`🏁 Ending Marathon Run for Player: ${player}, Run ID: ${runId}`);

    try {
        // Fetch the current Marathon Run
        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player }, type: "Marathon" },
        });

        if (!run) {
            console.error("❌ Run not found");
            return res.status(404).json({ error: "Run not found" });
        }

        // ✅ Extract `failedGame` and `failedSplit`
        const failedGameName = pastRun.failedSplit ? pastRun.failedSplit.game : null;
        const failedSplitName = pastRun.failedSplit ? pastRun.failedSplit.split : null;

        // ✅ Format `completedSplits` to count instead of listing names
        const completedSplitsCount = {};
        Object.keys(pastRun.completedSplits).forEach(game => {
            completedSplitsCount[game] = pastRun.completedSplits[game].length; // Count of completed splits
        });

        // ✅ Ensure `pastRun` is formatted correctly
        const pastRunEntry = {
            runId: run.pastRuns.length + 1, // Increment run ID
            order: pastRun.order, // Store game order
            completedSplits: completedSplitsCount, // ✅ Store number of completed splits
            failedGame: failedGameName, // ✅ Store failed game name
            failedSplit: failedSplitName, // ✅ Store failed split name
        };

        console.log("📥 Past Run Entry:", pastRunEntry);

        // ✅ Move run to `pastRuns` and mark as "Dead"
        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: {
                pastRuns: [...run.pastRuns, pastRunEntry], // 🔥 Append new pastRun
                status: "Dead", // ✅ Ensure run is marked as dead
            },
        });

        console.log("✅ Run moved to past runs successfully!");
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error ending run:", error);
        res.status(500).json({ error: "Failed to end run." });
    }
});

/** 
 * 🔹 Change Password
 */

router.put("/change-password", authenticateAdmin, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        // ✅ Ensure the admin is authenticated
        const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } }); // ✅ FIXED: Use `req.admin.id`

        if (!admin || !admin.password) {
            console.error("❌ Error: Admin not found or password is missing");
            return res.status(400).json({ error: "Invalid request: Admin not found or password missing." });
        }

        console.log("🔍 Comparing passwords:", { inputPassword: currentPassword, storedPassword: admin.password });

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

        console.log("✅ Password updated successfully for:", admin.username);

        // ✅ Force logout after password change
        res.json({ message: "Password updated successfully. Please log in again." });

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
        let updateData = {};
if (permittedPlayers !== undefined) {
    updateData.permittedPlayers = Array.isArray(permittedPlayers) ? permittedPlayers : [];
}

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
                permittedPlayers: Array.isArray(permittedPlayers) ? permittedPlayers : []
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

/** 
 * 🔹 GET ALL SINGLE GAME RUNS FOR A PLAYER 
 */
router.get("/runs/single/:player", authenticateAdmin, async (req, res) => {
    const { player } = req.params;

    try {
        console.log(`🔍 Fetching Single Game Runs for: ${player}`);

        // Find Single Game Runs linked to the player
        const singleGameRuns = await prisma.run.findMany({
            where: {
                type: "Single Game",
                player: {
                    name: player, // ✅ Adjusted to reference the Player relation
                },
            },
        });

        console.log(`✅ Found ${singleGameRuns.length} Single Game Runs`);
        res.json(singleGameRuns);
    } catch (error) {
        console.error("❌ Error fetching Single Game Runs:", error);
        res.status(500).json({ error: "Failed to fetch Single Game Runs" });
    }
});

/** 
 * 🔹 CREATE A NEW SINGLE GAME RUN 
 */
router.post("/runs/create", authenticateAdmin, async (req, res) => {
    try {
        const { name, description, badges, worldRecord, splits, player } = req.body;

        // Ensure required fields are present
        if (!name || !player || !splits.length) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Find the player in the database
        const playerData = await prisma.player.findUnique({
            where: { name: player },
        });

        if (!playerData) {
            return res.status(404).json({ error: "Player not found" });
        }

        // Create the new run
        const newRun = await prisma.run.create({
            data: {
                name,
                type: "Single Game",
                startDate: new Date(),
                description,
                badges,
                worldRecord,
                splits,
                status: "Alive",
                pastRuns: [],
                player: {
                    connect: { name: player }, // Link the run to the player
                },
            },
        });

        console.log("✅ New Single Game Run Created:", newRun);
        res.status(201).json(newRun);
    } catch (error) {
        console.error("❌ Error creating run:", error);
        res.status(500).json({ error: "Failed to create run." });
    }
});

/** 
 * 🔹 DELETE A SINGLE GAME RUN 
 */
router.delete("/runs/:runId", authenticateAdmin, async (req, res) => {
    const { runId } = req.params;

    try {
        console.log(`🗑️ Attempting to delete run with ID: ${runId}`);

        // Check if the run exists
        const run = await prisma.run.findUnique({
            where: { id: runId },
        });

        if (!run) {
            return res.status(404).json({ error: "Run not found" });
        }

        // Delete the run
        await prisma.run.delete({
            where: { id: runId },
        });

        console.log(`✅ Run ${runId} deleted successfully`);
        res.json({ message: "Run deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting run:", error);
        res.status(500).json({ error: "Failed to delete run." });
    }
});

/** 
 * 🔹 GET A SINGLE RUN BY ID
 */
router.get("/runs/:runId", authenticateAdmin, async (req, res) => {
    const { runId } = req.params;

    try {
        console.log(`🔍 Fetching details for Run ID: ${runId}`);

        const run = await prisma.run.findUnique({
            where: { id: runId },
        });

        if (!run) {
            return res.status(404).json({ error: "Run not found" });
        }

        console.log("✅ Run details fetched successfully:", run);
        res.json(run);
    } catch (error) {
        console.error("❌ Error fetching run details:", error);
        res.status(500).json({ error: "Failed to fetch run details." });
    }
});

/** 
 * 🔹 UPDATE A SINGLE GAME RUN 
 */
router.put("/runs/:runId", authenticateAdmin, async (req, res) => {
    const { runId } = req.params;
    const { name, description, badges, worldRecord, splits } = req.body;

    try {
        console.log(`🔄 Updating Run ID: ${runId}`);

        // Ensure the run exists
        const existingRun = await prisma.run.findUnique({
            where: { id: runId },
        });

        if (!existingRun) {
            return res.status(404).json({ error: "Run not found" });
        }

        // Update the run
        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: { name, description, badges, worldRecord, splits },
        });

        console.log("✅ Run updated successfully:", updatedRun);
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error updating run:", error);
        res.status(500).json({ error: "Failed to update run." });
    }
});

/** 
 * 🔹 GET a Single Game Run by player & runId
 */
router.get("/runs/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;

    try {
        console.log(`🔍 Fetching Run Data for Player: ${player}, Run ID: ${runId}`);

        const run = await prisma.run.findFirst({
            where: {
                id: runId,
                player: { name: player },
            },
            select: {
                pastRuns: true, // Fetch all past runs for this challenge
            },
        });

        if (!run) {
            return res.status(404).json({ error: "Run not found" });
        }

        // Ensure splits are always an array, even if null
        const formattedRun = {
            ...run,
            splits: run.splits ?? [], 
        };

        console.log(`✅ Found Run: ${formattedRun.name}`);
        res.json(formattedRun);
    } catch (error) {
        console.error("❌ Error fetching run data:", error);
        res.status(500).json({ error: "Failed to fetch run data" });
    }
});

/** 
 * 🔹 UPDATE Single Game Run Progress (Completed Splits & Failed Split)
 */
router.put("/runs/update/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;
    const { completedSplits, failedSplit, status, distancePB } = req.body;

    try {
        console.log(`🔄 Updating Run Progress for Player: ${player}, Run ID: ${runId}`);

        // Fetch the current run
        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player } },
        });

        if (!run) {
            return res.status(404).json({ error: "Run not found" });
        }

        // ✅ Ensure `completedSplits` is stored as a number
        const completedSplitsCount = typeof completedSplits === "number" ? completedSplits : (completedSplits?.length || 0);
        console.log("🔹 Received completedSplits:", completedSplits);
        console.log("✅ Processed completedSplitsCount:", completedSplitsCount);

        // ✅ Ensure `failedSplit` is stored correctly
        const failedSplitFormatted = failedSplit ? { split: failedSplit.split ?? failedSplit } : null;
        console.log("✅ Processed failedSplitFormatted:", failedSplitFormatted);

        // ✅ Fix `distancePB` assignment (Only set if not null)
        let distancePBFormatted = null;
        if (distancePB && distancePB.split) {
            distancePBFormatted = {
                split: distancePB.split, // ✅ Ensure it's stored correctly
                totalSplits: distancePB.totalSplits,
                reachedSplits: distancePB.reachedSplits,
            };
        }
        console.log("✅ Processed distancePBFormatted:", distancePBFormatted);

        // ✅ Update the database with the correct data
        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: {
                completedSplits: completedSplitsCount, 
                failedSplit: failedSplitFormatted, 
                status, 
                distancePB: distancePBFormatted ?? run.distancePB, // ✅ Keep existing `distancePB` if null
            },
        });

        console.log(`✅ Run Progress Updated: ${updatedRun.name}`);
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error updating run:", error);
        res.status(500).json({ error: "Failed to update run progress" });
    }
});

/** 
 * 🔹 MOVE Single Game Run to Past Runs (End Run)
 */
router.put("/runs/end/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;
    const { pastRun } = req.body; // ✅ Extract `pastRun` object properly

    try {
        console.log(`🔄 Ending Run for Player: ${player}, Run ID: ${runId}`);

        // Fetch the current run
        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player } },
        });

        if (!run) {
            return res.status(404).json({ error: "Run not found" });
        }

        if (!pastRun || !pastRun.completedSplits === undefined) {
            return res.status(400).json({ error: "Invalid past run data received." });
        }

        // ✅ Determine the correct `runId` dynamically
        const lastRunId = run.pastRuns.length > 0
            ? Math.max(...run.pastRuns.map(r => r.runId)) // Find max runId
            : 0;

        const newPastRun = {
            runId: lastRunId + 1,  // ✅ Guarantees unique ID
            failedSplit: pastRun.failedSplit || "Unknown",
            completedSplits: pastRun.completedSplits,
        };

        console.log("✅ Processed pastRun Data:", newPastRun);

        // ✅ Ensure `pastRuns` is updated correctly (Fixes empty/default issue)
        const updatedRun = await prisma.run.update({
            where: { id: runId },
            data: {
                pastRuns: run.pastRuns ? [...run.pastRuns, pastRun] : [pastRun], // ✅ If empty, initialize with the first run
                status: "Dead",
            },
        });

        console.log(`✅ Run Moved to Past Runs:`, newPastRun);
        res.json(updatedRun);
    } catch (error) {
        console.error("❌ Error ending run:", error);
        res.status(500).json({ error: "Failed to end run" });
    }
});

/** 
 * 🔹 DELETE PastRun
 */
router.delete("/runs/delete-past/:player/:runId/:index", authenticateAdmin, async (req, res) => {
    const { player, runId, index } = req.params;

    try {
        const run = await prisma.run.findFirst({ where: { id: runId, player: { name: player } } });

        if (!run || !run.pastRuns) {
            return res.status(404).json({ error: "Run or past runs not found" });
        }

        run.pastRuns.splice(index, 1); // ✅ Remove the past run at index

        // ✅ Reorder run IDs
        run.pastRuns = run.pastRuns.map((run, i) => ({ ...run, runId: i + 1 }));

        await prisma.run.update({
            where: { id: runId },
            data: { pastRuns: run.pastRuns },
        });

        res.json({ success: true });
    } catch (error) {
        console.error("❌ Error deleting past run:", error);
        res.status(500).json({ error: "Failed to delete past run" });
    }
});

router.get("/runs/past/:player/:runId", authenticateAdmin, async (req, res) => {
    const { player, runId } = req.params;

    try {
        console.log(`📡 Fetching past runs for Player: ${player}, Run ID: ${runId}`);

        const run = await prisma.run.findFirst({
            where: { id: runId, player: { name: player } },
            select: { pastRuns: true }
        });

        if (!run) {
            console.log("❌ Run not found");
            return res.status(404).json({ error: "Run not found" });
        }

        console.log("✅ Past Runs Fetched:", run.pastRuns);
        res.json(run.pastRuns);
    } catch (error) {
        console.error("❌ Error fetching past runs:", error);
        res.status(500).json({ error: "Failed to fetch past runs." });
    }
});

module.exports = router;