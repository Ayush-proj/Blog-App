import express from 'express';
import upload from '../middleware/upload.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

/**
 * 🎓 UPLOAD ROUTES
 * 
 * Routes for handling image uploads to Cloudinary
 */

const router = express.Router();

// Upload single image
// The upload middleware will initialize Cloudinary on first use
router.post('/', protect, upload.single('image'), uploadImage);

// Delete image (optional)
router.delete('/:publicId', protect, deleteImage);

export default router;
