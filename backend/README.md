# ⚙️ Blog-App Backend

The robust API powering the Blog-App platform, built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Key Features
- **JWT Authentication**: Secure user registration and login with token-based sessions.
- **Role-Based Access Control**: Middleware to distinguish between regular Users and Admins.
- **Image Management**: Direct integration with **Cloudinary** for image uploads and optimizations.
- **Post CRUD**: Complete API endpoints for managing blog content.
- **Input Validation**: Schema-based validation using **Joi**.
- **Error Handling**: Centralized error management for consistent API responses.

## 🛠️ Tech Stack
- **Server**: Express.js (on Node.js 20+)
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT & Bcryptjs
- **File Handling**: Multer & Multer-storage-cloudinary

## 🏃 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file:
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=name
   CLOUDINARY_API_KEY=key
   CLOUDINARY_API_SECRET=secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 API Endpoints Summary
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create a post (Admin only)
- `POST /api/upload` - Single image upload
- `POST /api/contact` - Submit contact form
