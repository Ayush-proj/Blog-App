import express from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    getAdminStats
} from "../controllers/authController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put('/password', protect, updatePassword);

// ============================================
// 🛡️ ADMIN ONLY ROUTES
// ============================================
// These routes require both authentication AND admin role

// Get admin dashboard statistics
router.get("/admin/stats", protect, isAdmin, getAdminStats);

// User management
router.get("/admin/users", protect, isAdmin, getAllUsers);
router.get("/admin/users/:id", protect, isAdmin, getUserById);
router.delete("/admin/users/:id", protect, isAdmin, deleteUser);
router.put("/admin/users/:id/role", protect, isAdmin, updateUserRole);

export default router;
