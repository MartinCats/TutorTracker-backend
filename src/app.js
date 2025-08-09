import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './db.js';
import studentsRoute from './routes/students.js';
import enrollmentsRoute from './routes/enrollments.js';
import dashboardRoute from './routes/dashboard.js';

dotenv.config();
export const app = express();
app.use(cors({ origin: process.env.ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ใช้ path แบบมี /api (ให้ตรงกับที่ frontend เรียก)
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/students', studentsRoute);
app.use('/api/enrollments', enrollmentsRoute);
app.use('/api/dashboard', dashboardRoute);

export async function init() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');
  await connect(uri);
}
