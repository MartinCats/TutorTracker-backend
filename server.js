import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './src/db.js';
import studentsRoute from './src/routes/students.js';
import enrollmentsRoute from './src/routes/enrollments.js';
import dashboardRoute from './src/routes/dashboard.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ORIGIN?.split(',') || '*'}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/students', studentsRoute);
app.use('/api/enrollments', enrollmentsRoute);
app.use('/api/dashboard', dashboardRoute);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });