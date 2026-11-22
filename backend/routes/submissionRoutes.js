const express = require('express');
const router = express.Router();
const {
  gradeSubmission,
  downloadSubmissionFile
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.put('/:id/grade', protect, authorize('instructor'), gradeSubmission);
router.get('/:id/download', protect, downloadSubmissionFile);

module.exports = router;
