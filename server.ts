import app from './src/app';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.config';

dotenv.config();

const PORT = process.env.PORT || 8000;
 
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Admin Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start Admin Service:", error);
        process.exit(1);
    }
};

startServer();