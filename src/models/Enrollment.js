import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    hours: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
  },
  { _id: false, timestamps: false }
);

const EnrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    courseName: { type: String, required: true, trim: true },
    totalHours: { type: Number, required: true, min: 0 },
    sessions: { type: [SessionSchema], default: [] },
  },
  { timestamps: true }
);

EnrollmentSchema.virtual('usedHours').get(function () {
  return (this.sessions || []).reduce((sum, s) => sum + (s.hours || 0), 0);
});

EnrollmentSchema.virtual('remainingHours').get(function () {
  return Math.max(0, this.totalHours - this.usedHours);
});

EnrollmentSchema.set('toObject', { virtuals: true });
EnrollmentSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Enrollment', EnrollmentSchema);