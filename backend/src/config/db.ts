import mongoose from "mongoose";
import { MONGO_URI } from "../constants/constants";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to db");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Could not connect to db: ${error.message}`);
      process.exit(1);
    }
    console.log(error);
  }
};
