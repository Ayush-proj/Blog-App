import { cloudinary } from '../config/cloudinary.js';

/**
 * 🎓 UPLOAD CONTROLLER
 * 
 * Handles image uploads to Cloudinary
 * The actual upload is done by Multer middleware
 * This controller just returns the uploaded image URL
 */

export const uploadImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Multer + Cloudinary already uploaded the file
    // req.file.path contains the Cloudinary URL
    console.log('✅ Image uploaded to Cloudinary:', req.file.path);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename // Cloudinary public ID (for deletion)
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};

/**
 * 🎓 DELETE IMAGE FROM CLOUDINARY
 * 
 * Optional: Delete an image from Cloudinary
 * Useful when deleting a blog post
 */
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log('🗑️ Image deleted from Cloudinary:', result);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
};
