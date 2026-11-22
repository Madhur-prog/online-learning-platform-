const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getInstructorCourses,
  updateProgress
} = require('../controllers/courseController');

const { getCourseLessons, createLesson } = require('../controllers/lessonController');
const { getCourseMaterials, uploadMaterial } = require('../controllers/materialController');
const { getCourseQuizzes, createQuiz, getCourseQuizAttempts } = require('../controllers/quizController');
const { getCourseAssignments, createAssignment } = require('../controllers/assignmentController');
const { getCourseDiscussions, createDiscussion } = require('../controllers/discussionController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadMaterial: multerUploadMaterial } = require('../middleware/upload');

// Base course routes
router.get('/', getAllCourses);
router.get('/my/enrolled', protect, authorize('student'), getEnrolledCourses);
router.get('/my/teaching', protect, authorize('instructor'), getInstructorCourses);

router.get('/:id', (req, res, next) => {
  // Optional auth middleware so req.user is populated if token is present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, getCourseById);

router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

// Enrollment & Progress (Student)
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.post('/:id/progress', protect, authorize('student'), updateProgress);

// Lessons for a course
router.get('/:id/lessons', getCourseLessons);
router.post('/:id/lessons', protect, authorize('instructor'), createLesson);

// Materials for a course
router.get('/:id/materials', protect, getCourseMaterials);
router.post('/:id/materials', protect, authorize('instructor'), multerUploadMaterial.single('file'), uploadMaterial);

// Quizzes for a course
router.get('/:id/quizzes', protect, getCourseQuizzes);
router.post('/:id/quizzes', protect, authorize('instructor'), createQuiz);
router.get('/:id/quizzes/attempts', protect, authorize('instructor'), getCourseQuizAttempts);

// Assignments for a course
router.get('/:id/assignments', protect, getCourseAssignments);
router.post('/:id/assignments', protect, authorize('instructor'), createAssignment);

// Course Discussions (Added requirement after Sprint 1)
router.get('/:id/discussions', protect, getCourseDiscussions);
router.post('/:id/discussions', protect, createDiscussion);

module.exports = router;
