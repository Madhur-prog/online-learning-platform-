const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: 'PDF'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Submitted', 'Late', 'Graded'],
    default: 'Submitted'
  },
  marks: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date,
    default: null
  }
});

submissionSchema.index({ assignmentId: 1, studentId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
