import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js'; // MUST have .js

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  // 1. Try to connect
  await connectDB();

  // 2. Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

console.log("MONGO_URI present:", !!process.env.MONGO_URI);

startServer();