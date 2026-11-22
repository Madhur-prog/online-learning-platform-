const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    default: null
  },
  title: {
    type: String,
    required: [true, 'Please provide a material title'],
    trim: true
  },
  filePath: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    required: true,
    enum: ['PDF', 'DOCX', 'PPTX']
  },
  fileSize: {
    type: String,
    default: '1.0 MB'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
