import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

/**
 * 🎓 CLOUDINARY CONFIGURATION
 * 
 * This function configures Cloudinary when called
 * It's called from the routes file AFTER dotenv has loaded
 */

let isConfigured = false;
let upload = null;

const initializeCloudinary = () => {
  if (isConfigured) {
    return upload;
  }

  console.log('🔍 Initializing Cloudinary...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
  console.log('API Key:', process.env.CLOUDINARY_API_KEY || 'MISSING');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blog-posts',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        {
          width: 1200,
          height: 800,
          crop: 'limit'
        }
      ]
    }
  });

  upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });

  isConfigured = true;
  console.log('✅ Cloudinary initialized successfully');
  
  return upload;
};

export { cloudinary, initializeCloudinary };
