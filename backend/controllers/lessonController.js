const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const StudyMaterial = require('../models/StudyMaterial');

// @desc    Get all lessons for a course
// @route   GET /api/courses/:id/lessons
// @access  Public (or authenticated)
exports.getCourseLessons = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public (or authenticated)
exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const materials = await StudyMaterial.find({ lessonId: lesson._id });

    res.status(200).json({
      success: true,
      lesson: {
        ...lesson.toObject(),
        materials
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lesson
// @route   POST /api/courses/:id/lessons
// @access  Private (Instructor only)
exports.createLesson = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, videoUrl, duration, order } = req.body;

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
        message: 'Not authorized to add lessons to this course'
      });
    }

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and video URL are required'
      });
    }

    const lessonCount = await Lesson.countDocuments({ courseId });
    const lessonOrder = order || lessonCount + 1;

    const lesson = await Lesson.create({
      courseId,
      title,
      description: description || '',
      videoUrl,
      duration: duration || '10:00',
      order: lessonOrder
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor only)
exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const course = await Course.findById(lesson.courseId);
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this lesson'
      });
    }

    const { title, description, videoUrl, duration, order } = req.body;
    if (title) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (videoUrl) lesson.videoUrl = videoUrl;
    if (duration) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;

    await lesson.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor only)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const course = await Course.findById(lesson.courseId);
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    await StudyMaterial.deleteMany({ lessonId: lesson._id });
    await Lesson.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
