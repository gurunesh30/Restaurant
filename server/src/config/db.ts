import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    // These are the "Stable API" options from the Atlas snippet
    const clientOptions: mongoose.ConnectOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    };

    console.log("⏳ Attempting to connect to Atlas...");
    const conn = await mongoose.connect(mongoUri, clientOptions);

    // This is the "Ping" part from the Atlas snippet
    if (conn.connection.db) {
      await conn.connection.db.admin().command({ ping: 1 });
      console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    }

  } catch (error) {
    console.error("❌ Database Connection Error:");
    throw error instanceof Error ? error : new Error(String(error));
  }
};

export default connectDB;