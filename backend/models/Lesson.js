const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL']
  },
  duration: {
    type: String,
    default: '10:00'
  },
  order: {
    type: Number,
    required: true,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
