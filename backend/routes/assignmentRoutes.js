const express = require('express');
const router = express.Router();
const {
  getAssignmentById,
  submitAssignment,
  getStudentSubmissionStatus,
  getSubmissionsForAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadAssignment } = require('../middleware/upload');

router.get('/:id', protect, getAssignmentById);
router.post('/:id/submit', protect, authorize('student'), uploadAssignment.single('file'), submitAssignment);
router.get('/:id/status', protect, authorize('student'), getStudentSubmissionStatus);
router.get('/:id/submissions', protect, authorize('instructor'), getSubmissionsForAssignment);

module.exports = router;
