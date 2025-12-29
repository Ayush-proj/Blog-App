import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from 'url'; 

// 🎓 IMPORTANT: Configure dotenv FIRST before any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Now import everything else AFTER dotenv is configured
import express from "express"
import cors from "cors"
import mongoDBConnect from "./config/db.js"
import postRoutes from "./routes/postRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; 

console.log(`[DIAGNOSTIC] PORT status: ${process.env.PORT ? 'Loaded' : 'Undefined'}`);
console.log(`[DIAGNOSTIC] URI status: ${process.env.MONGO_URI ? 'Loaded' : 'Undefined'}`);
console.log(`[DIAGNOSTIC] Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'Undefined'}`);
console.log(`[DIAGNOSTIC] Cloudinary API Key: ${process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'Undefined'}`);

const app = express();

// MIDDLEWARE (runs before routes)
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
})); // Allow frontend to connect
app.use(express.json()); // Parse JSON data from requests

const PORT = process.env.PORT || 3001;

// ROUTES - Connect your routes here
app.use('/api/posts', postRoutes); // All post routes start with /api/posts
app.use('/api/auth', authRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/contact',contactRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Blog API is running! 🚀' });
});

// ERROR HANDLER (runs if something goes wrong)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});

async function startApplication() {
    try {
        // 1. AWAIT THE DB CONNECTION
        // Execution pauses here until the connection is either successful or throws an error.
        await mongoDBConnect(); 

        // 2. START THE HTTP SERVER
        // This only happens AFTER the database is confirmed to be ready.
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        // If DB fails, we already exit in db.js, but this catches any other startup error.
        console.error("Application startup failed:", error);
    }
}

// 3. EXECUTE THE STARTUP SEQUENCE
startApplication();



