const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const { calculateQuizScore } = require('../services/quizScorer');

// @desc    Get all quizzes for a course
// @route   GET /api/courses/:id/quizzes
// @access  Private (Authenticated users)
exports.getCourseQuizzes = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const isInstructor = req.user && req.user.role === 'instructor';

    let quizzesQuery = Quiz.find({ courseId });

    if (!isInstructor) {
      quizzesQuery = quizzesQuery.select('-questions.correctOptionIndex -questions.explanation');
    }

    const quizzes = await quizzesQuery.sort({ createdAt: 1 });

    // If student, attach attempt information
    let enrichedQuizzes = quizzes.map(q => {
      const totalMarks = (q.questions || []).reduce((sum, item) => sum + (item.marks || 1), 0);
      return {
        ...q.toObject(),
        totalMarks
      };
    });

    if (req.user && req.user.role === 'student') {
      enrichedQuizzes = await Promise.all(
        enrichedQuizzes.map(async (quiz) => {
          const attempt = await QuizAttempt.findOne({
            quizId: quiz._id,
            studentId: req.user._id
          }).sort({ submittedAt: -1 });

          return {
            ...quiz,
            hasAttempted: !!attempt,
            latestAttempt: attempt || null
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      count: enrichedQuizzes.length,
      quizzes: enrichedQuizzes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private (Authenticated users)
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const isInstructor = req.user.role === 'instructor';
    const attempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      studentId: req.user._id
    }).sort({ submittedAt: -1 });

    const quizData = quiz.toObject();

    // If user is a student, hide correct answers and explanations before submission
    if (!isInstructor) {
      quizData.questions = quizData.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }));
    }

    res.status(200).json({
      success: true,
      quiz: quizData,
      hasAttempted: !!attempt,
      attempt: attempt || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a quiz
// @route   POST /api/courses/:id/quizzes
// @access  Private (Instructor only)
exports.createQuiz = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, passingPercentage, questions } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create quizzes for this course'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Quiz title is required'
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Quiz must contain at least one question'
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.options || q.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} must have question text and at least 2 options`
        });
      }
      if (q.correctOptionIndex === undefined || q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
        return res.status(400).json({
          success: false,
          message: `Question #${i + 1} has an invalid correct option index`
        });
      }
    }

    const quiz = await Quiz.create({
      courseId,
      title,
      description: description || '',
      passingPercentage: passingPercentage || 60,
      questions
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student only)
exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // TC08 validation: answers required
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Quiz answers are required and must not be empty'
      });
    }

    // Calculate score using backend service (Fix for BUG-001)
    const scoringResult = calculateQuizScore(quiz, answers);

    // Save attempt in MongoDB
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      studentId: req.user._id,
      courseId: quiz.courseId,
      answers: scoringResult.answers,
      score: scoringResult.score,
      totalMarks: scoringResult.totalMarks,
      percentage: scoringResult.percentage,
      passed: scoringResult.passed
    });

    res.status(200).json({
      success: true,
      message: scoringResult.passed ? 'Congratulations! You passed the quiz.' : 'Quiz completed. Keep practicing!',
      attemptId: attempt._id,
      result: {
        quizTitle: quiz.title,
        score: scoringResult.score,
        totalMarks: scoringResult.totalMarks,
        percentage: scoringResult.percentage,
        passed: scoringResult.passed,
        passingPercentage: quiz.passingPercentage,
        submittedAt: attempt.submittedAt,
        answers: scoringResult.answers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific quiz attempt result
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
exports.getQuizResult = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quizId')
      .populate('studentId', 'name email');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    // TC10: Student trying to view another student's quiz attempt -> 403 Forbidden
    if (
      req.user.role === 'student' &&
      attempt.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view other students\' private quiz results.'
      });
    }

    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quiz attempts for an instructor's course
// @route   GET /api/courses/:id/quizzes/attempts
// @access  Private (Instructor only)
exports.getCourseQuizAttempts = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view quiz analytics for this course'
      });
    }

    const attempts = await QuizAttempt.find({ courseId })
      .populate('studentId', 'name email avatar')
      .populate('quizId', 'title passingPercentage')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });
  } catch (error) {
    next(error);
  }
};
