// src/db.js
import mongoose from 'mongoose';

export async function connect(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000, // หา node ไม่เจอให้ตัดใจไว
    connectTimeoutMS: 5000,
    socketTimeoutMS: 20000
  });
  return mongoose.connection;
}
