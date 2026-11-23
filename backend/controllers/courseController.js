const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const StudyMaterial = require('../models/StudyMaterial');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get all courses (with optional search & category filter)
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructorId', 'name email avatar bio')
      .sort({ createdAt: -1 });

    // Enhance each course with lessonCount and enrolledCount
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const lessonCount = await Lesson.countDocuments({ courseId: course._id });
        const enrolledCount = await Enrollment.countDocuments({ courseId: course._id });
        return {
          ...course.toObject(),
          lessonCount,
          enrolledCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name email avatar bio');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    const materials = await StudyMaterial.find({ courseId: course._id });
    let quizzes = await Quiz.find({ courseId: course._id })
      .select('-questions.correctOptionIndex -questions.explanation')
      .sort({ createdAt: 1 });
    let assignments = await Assignment.find({ courseId: course._id }).sort({ dueDate: 1 });
    const enrolledCount = await Enrollment.countDocuments({ courseId: course._id });

    let isEnrolled = false;
    let enrollmentData = null;

    if (req.user) {
      enrollmentData = await Enrollment.findOne({
        courseId: course._id,
        studentId: req.user._id
      });
      if (enrollmentData) {
        isEnrolled = true;
      }

      if (req.user.role === 'student') {
        quizzes = await Promise.all(
          quizzes.map(async (quiz) => {
            const attempt = await QuizAttempt.findOne({
              quizId: quiz._id,
              studentId: req.user._id
            }).sort({ submittedAt: -1 });

            const totalMarks = (quiz.questions || []).reduce((sum, q) => sum + (q.marks || 1), 0);

            return {
              ...quiz.toObject(),
              totalMarks,
              hasAttempted: !!attempt,
              latestAttempt: attempt || null
            };
          })
        );

        assignments = await Promise.all(
          assignments.map(async (assign) => {
            const submission = await Submission.findOne({
              assignmentId: assign._id,
              studentId: req.user._id
            });

            return {
              ...assign.toObject(),
              submission: submission || null,
              status: submission ? submission.status : 'Not Submitted'
            };
          })
        );
      } else {
        quizzes = quizzes.map(quiz => ({
          ...quiz.toObject(),
          totalMarks: (quiz.questions || []).reduce((sum, q) => sum + (q.marks || 1), 0)
        }));
      }
    } else {
      quizzes = quizzes.map(quiz => ({
        ...quiz.toObject(),
        totalMarks: (quiz.questions || []).reduce((sum, q) => sum + (q.marks || 1), 0)
      }));
    }

    res.status(200).json({
      success: true,
      course: {
        ...course.toObject(),
        lessons,
        materials,
        quizzes,
        assignments,
        enrolledCount,
        isEnrolled,
        enrollment: enrollmentData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, thumbnail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title, description, and category'
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level: level || 'Beginner',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      instructorId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor only)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const { title, description, category, level, thumbnail } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (thumbnail) course.thumbnail = thumbnail;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Lesson.deleteMany({ courseId: course._id });
    await StudyMaterial.deleteMany({ courseId: course._id });
    await Quiz.deleteMany({ courseId: course._id });
    await Assignment.deleteMany({ courseId: course._id });
    await Enrollment.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course and associated content deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student only)
exports.enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId,
      progress: 0,
      completedLessons: []
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled courses for student
// @route   GET /api/courses/my/enrolled
// @access  Private (Student)
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate({
        path: 'courseId',
        populate: { path: 'instructorId', select: 'name email avatar' }
      })
      .sort({ enrolledAt: -1 });

    const enrolledList = await Promise.all(
      enrollments
        .filter(e => e.courseId) // filter out any deleted courses
        .map(async (e) => {
          const totalLessons = await Lesson.countDocuments({ courseId: e.courseId._id });
          return {
            enrollmentId: e._id,
            enrolledAt: e.enrolledAt,
            progress: e.progress,
            completedLessonsCount: e.completedLessons ? e.completedLessons.length : 0,
            completedLessons: e.completedLessons || [],
            totalLessons,
            course: e.courseId
          };
        })
    );

    res.status(200).json({
      success: true,
      count: enrolledList.length,
      enrollments: enrolledList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get instructor courses with analytics
// @route   GET /api/courses/my/teaching
// @access  Private (Instructor)
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructorId: req.user._id }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      courses.map(async (course) => {
        const lessonCount = await Lesson.countDocuments({ courseId: course._id });
        const enrolledCount = await Enrollment.countDocuments({ courseId: course._id });
        const quizCount = await Quiz.countDocuments({ courseId: course._id });
        const assignmentCount = await Assignment.countDocuments({ courseId: course._id });

        return {
          ...course.toObject(),
          lessonCount,
          enrolledCount,
          quizCount,
          assignmentCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      courses: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student lesson completion progress
// @route   POST /api/courses/:id/progress
// @access  Private (Student)
exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.id;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID is required'
      });
    }

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found'
      });
    }

    const totalLessons = await Lesson.countDocuments({ courseId });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 100;
    if (enrollment.progress > 100) enrollment.progress = 100;

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    });
  } catch (error) {
    next(error);
  }
};
