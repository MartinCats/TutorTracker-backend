import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Student', StudentSchema);