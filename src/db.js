import mongoose from 'mongoose';

export async function connect(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,  // 5s หา server ไม่เจอให้ตัดใจ
    connectTimeoutMS: 5000,          // 5s handshake/connect
    socketTimeoutMS: 20000           // 20s เผื่อค้าง
  });
  return mongoose.connection;
}
