import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import './models/User.js';
import './models/MenuItem.js';
import './models/Table.js';
import './models/Reservation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();