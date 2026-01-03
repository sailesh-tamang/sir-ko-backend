import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        return;
    } catch (error: any) {
        console.error("Database Error:", error);

        // If local MongoDB is not available, fall back to an in-memory server (development)
        if (error.message && error.message.includes("ECONNREFUSED")) {
            console.log("Falling back to in-memory MongoDB for development...");
            try {
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                await mongoose.connect(uri);
                console.log("Connected to in-memory MongoDB");
                return;
            } catch (memErr) {
                console.error("Failed to start in-memory MongoDB:", memErr);
                process.exit(1);
            }
        }

        process.exit(1);
    }
}