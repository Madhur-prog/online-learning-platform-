const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const materialsDir = path.join(__dirname, '..', 'uploads', 'materials');
const assignmentsDir = path.join(__dirname, '..', 'uploads', 'assignments');

[materialsDir, assignmentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for Study Materials
const materialStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, materialsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `material-${uniqueSuffix}${ext}`);
  }
});

// Storage configuration for Assignment Submissions
const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assignmentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `submission-${uniqueSuffix}${ext}`);
  }
});

// File filter for Study Materials (PDF, DOCX, PPTX)
const materialFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and PPTX files are allowed for study materials.'), false);
  }
};

// File filter for Assignment Submissions (PDF, DOCX)
const assignmentFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed for assignment submissions.'), false);
  }
};

const uploadMaterial = multer({
  storage: materialStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: materialFileFilter
});

const uploadAssignment = multer({
  storage: assignmentStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: assignmentFileFilter
});

module.exports = {
  uploadMaterial,
  uploadAssignment
};
