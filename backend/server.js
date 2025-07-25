// backend/server.js
import app from './app.js';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});