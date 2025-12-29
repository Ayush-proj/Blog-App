import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByCategory,
    likePost,
    unlikePost
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js"; 

/**
 * ROUTES = URL paths that users can access
 * Maps URLs to controller functions
 */

const router = express.Router();

// Base URL: /api/posts

// CREATE: POST /api/posts
// router.post("/", createPost);

// PUBLIC ROUTES (no authentication required)
router.get("/", getAllPosts);                    // Get all posts
router.get("/category/:category", getPostsByCategory); // Get posts by category
router.get("/:id", getPostById);                 // Get single post

// PROTECTED ROUTES (authentication required)
router.post("/", protect, createPost);           // Create post
router.put("/:id", protect, updatePost);         // Update post
router.delete("/:id", protect, deletePost);      // Delete post
router.post("/:id/like", protect, likePost);     // Like post
router.delete("/:id/like", protect, unlikePost); // Unlike post




export default router;
