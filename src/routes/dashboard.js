import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('student');
    const data = enrollments.map((e) => ({
      id: e._id,
      studentId: e.student?._id,
      studentName: e.student?.name,
      courseName: e.courseName,
      totalHours: e.totalHours,
      usedHours: e.usedHours,
      remainingHours: e.remainingHours,
      lastStudiedAt: e.sessions?.length ? e.sessions[e.sessions.length - 1].date : null,
    }));

    // Aggregate by student for quick dashboard summaries
    const byStudent = Object.values(
      data.reduce((acc, row) => {
        const key = String(row.studentId);
        if (!acc[key]) acc[key] = { studentId: row.studentId, studentName: row.studentName, totalRemaining: 0, courses: [] };
        acc[key].totalRemaining += row.remainingHours;
        acc[key].courses.push(row);
        return acc;
      }, {})
    );

    res.json({ enrollments: data, students: byStudent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;