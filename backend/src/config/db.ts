import mongoose from "mongoose";
import { config } from "./index";

export const connectToDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error();
        (
            "Failed to connect to MongoDB"
        );
        process.exit(1);
    }
};
