const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
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
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOptionIndex: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    marksEarned: {
      type: Number,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

quizAttemptSchema.index({ studentId: 1, quizId: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
