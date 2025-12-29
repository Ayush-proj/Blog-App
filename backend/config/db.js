// config/db.js

import mongoose from "mongoose"; // Use ES Module import

/**
 * Handles the asynchronous connection to the MongoDB database.
 */
const mongoDBConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB connected: ${connection.connection.host} ✅`);
        
        return connection; 

    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // CRITICAL: Exit if the DB connection fails
        process.exit(1);
    }
}

// 🎯 Use ES Module default export for server.js to import it correctly
export default mongoDBConnect;