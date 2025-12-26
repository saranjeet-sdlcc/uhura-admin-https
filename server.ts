// server.ts
import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4007; // Different port than your other services

app.listen(PORT, () => {
    console.log(`🚀 Admin Service running on port ${PORT}`);
});