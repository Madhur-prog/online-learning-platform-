const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr && arr.length >= 2;
      },
      message: 'Question must have at least 2 options'
    },
    required: true
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  marks: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide quiz title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  passingPercentage: {
    type: Number,
    required: true,
    default: 60,
    min: 0,
    max: 100
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating total marks
quizSchema.virtual('totalMarks').get(function() {
  if (!this.questions || !this.questions.length) return 0;
  return this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
});

module.exports = mongoose.model('Quiz', quizSchema);
