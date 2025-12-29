import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * AUTH MIDDLEWARE
 * Protects routes by verifying JWT token
 * Usage: Add this middleware to any route that needs authentication
 */

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in Authorization header
        // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login."
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-this");

        // 3. Find user by ID from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // 4. Attach user to request object
        req.user = user;

        // 5. Continue to next middleware/controller
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized. Invalid token."
        });
    }
};

/**
 * ADMIN MIDDLEWARE
 * Restricts access to admin users only
 * Usage: Add after protect middleware - protect, isAdmin
 */
export const isAdmin = async (req, res, next) => {
    try {
        // Check if user exists (should be set by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login."
            });
        }

        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // User is admin, continue
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error checking admin status"
        });
    }
};
