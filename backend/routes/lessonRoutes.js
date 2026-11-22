const express = require('express');
const router = express.Router();
const {
  getLessonById,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { getLessonMaterials } = require('../controllers/materialController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/:id', protect, getLessonById);
router.put('/:id', protect, authorize('instructor'), updateLesson);
router.delete('/:id', protect, authorize('instructor'), deleteLesson);
router.get('/:id/materials', protect, getLessonMaterials);

module.exports = router;
