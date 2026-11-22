const express = require('express');
const router = express.Router();
const {
  getQuizById,
  submitQuiz,
  getQuizResult
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/attempts/:attemptId', protect, getQuizResult);

module.exports = router;
