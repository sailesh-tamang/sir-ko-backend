// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

function buildMongoUriFromParts(): string | undefined {
  const user = process.env.MONGO_USER;
  const pass = process.env.MONGO_PASS;
  const host = process.env.MONGO_HOST; // cluster host (for +srv)
  const db = process.env.MONGO_DB || "admin";

  if (user && pass && host) {
    const encodedPass = encodeURIComponent(pass);
    // Use srv by default if host looks like Atlas
    const isSrv = host.includes(".mongodb.net") || host.includes("cluster");
    if (isSrv) {
      return `mongodb+srv://${user}:${encodedPass}@${host}/${db}?authSource=admin&retryWrites=true&w=majority`;
    }

    return `mongodb://${user}:${encodedPass}@${host}/${db}?authSource=admin&retryWrites=true&w=majority`;
  }

  return undefined;
}

// Priority: explicit full URI env, then built-from-parts
export const MONGODB_URI: string = (process.env.MONGO_URI || process.env.MONGODB_URI || buildMongoUriFromParts()) as string;

if (!MONGODB_URI) {
  throw new Error("❌ No MongoDB connection info found. Set MONGO_URI or MONGO_USER/MONGO_PASS/MONGO_HOST in .env");
}

export const JWT_SECRET: string = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in .env");
}

export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export const BCRYPT_SALT_ROUNDS: number = process.env.BCRYPT_SALT_ROUNDS
  ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
  : 10;