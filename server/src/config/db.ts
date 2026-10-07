import mongoose from 'mongoose';

// Cache the connection promise so serverless invocations reuse one connection.
let cached: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (!cached) {
    cached = mongoose.connect(process.env.MONGODB_URI).catch((err: unknown) => {
      cached = null;
      throw err;
    });
  }
  await cached;
}
