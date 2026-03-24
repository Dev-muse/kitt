import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}
/* 
Connection with mongodb always breaks so we need to cache the connection.
*/
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached =
  global.mongooseCache ||
  (global.mongooseCache = { conn: null, promise: null });

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  //if no connection is cached, create a new one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    console.info("Connected to MongoDB");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};
