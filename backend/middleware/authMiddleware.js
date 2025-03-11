const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded; // Add admin data to request
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { authenticateAdmin };