import mongoose from "mongoose";
import { MONGO_URI } from "../config";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URI).then(() => {
      console.log("MongoDB connected successfully");
    });
  } catch (error: any) {
    console.log(`Issue connecting mongodb`, error.message);
    // Retry connection after 5 seconds
    setTimeout(connectMongoDb, 5000);
  }
};

export default connectMongoDb;
