import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';

const router = Router();

// Create enrollment (assign course to student)
router.post('/', async (req, res) => {
  try {
    const { studentId, courseName, totalHours } = req.body;
    if (!studentId || !courseName || totalHours == null) {
      return res.status(400).json({ message: 'studentId, courseName, totalHours are required' });
    }
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const enrollment = await Enrollment.create({ student: studentId, courseName, totalHours });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List enrollments (optionally populated)
router.get('/', async (req, res) => {
  try {
    const includeStudent = String(req.query.includeStudent || '1') === '1';
    const docs = await Enrollment.find()
      .populate(includeStudent ? 'student' : '')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a study session
router.post('/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hours, note } = req.body;
    if (!date || hours == null) return res.status(400).json({ message: 'date and hours are required' });

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.sessions.push({ date: new Date(date), hours: Number(hours), note });
    await enrollment.save();

    // return with virtuals
    const saved = await Enrollment.findById(id).populate('student');
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;