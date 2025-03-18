import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connectToDB() {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: process.env.DB_NAME as string,
        bufferCommands: false,
      }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    globalWithMongoose.mongoose = cached;

    return cached.conn;
  } catch (error: any) {
    console.log(error.message, "Database connection error")
    throw new Error(error)
  }
}