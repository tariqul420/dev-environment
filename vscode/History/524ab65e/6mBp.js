'use server';

import mongoose from 'mongoose';
import logger from './logger';

const globalWithMongoose = globalThis;

const cached = globalWithMongoose.mongoose || { conn: null, promise: null };
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  const password = process.env.DATABASE_PASSWORD;
  const rawUri = process.env.DATABASE_URL;

  if (!rawUri) {
    throw new Error('❌ DATABASE_URL is not defined in environment');
  }

  const uri = password
    ? rawUri.replace('<db_password>', encodeURIComponent(password))
    : rawUri;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        logger.error("MongoDB connection failed", { error });
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;