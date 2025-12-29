import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

/**
 * 🎓 CLOUDINARY UPLOAD MIDDLEWARE
 * 
 * This middleware handles image uploads to Cloudinary
 */

// Lazy initialization - only configure when first used
let upload = null;

const getUploadMiddleware = () => {
  if (upload) {
    return upload;
  }

  console.log('🔍 Configuring Cloudinary from middleware...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY || '❌ MISSING');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ MISSING');

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  // Configure Cloudinary Storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blog-posts',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  });

  // Create multer upload instance
  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

  console.log('✅ Cloudinary upload middleware configured');
  return upload;
};

// Export a middleware function that initializes on first use
export default {
  single: (fieldName) => {
    return (req, res, next) => {
      const uploadMiddleware = getUploadMiddleware();
      return uploadMiddleware.single(fieldName)(req, res, next);
    };
  }
};
