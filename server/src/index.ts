import dotenv from 'dotenv';

import app from './app.js';
import connectDB from './config/db.js';
import './models/User.js';
import './models/MenuItem.js';
import './models/Table.js';
import './models/Reservation.js';
import './models/Category.js';

const PORT = 8000;
dotenv.config();

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