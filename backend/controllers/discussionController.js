const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper to check if user has access to course discussions
const checkCourseAccess = async (courseId, user) => {
  const course = await Course.findById(courseId);
  if (!course) return { allowed: false, reason: 'Course not found' };

  if (user.role === 'instructor') {
    // Instructor must own the course
    if (course.instructorId.toString() === user._id.toString()) {
      return { allowed: true, course };
    }
    // Also allow other instructors to participate if needed, or enforce course ownership
    return { allowed: true, course };
  }

  // If student, check enrollment
  const enrollment = await Enrollment.findOne({
    courseId,
    studentId: user._id
  });

  if (!enrollment) {
    return { allowed: false, reason: 'You must be enrolled in this course to access the discussion forum' };
  }

  return { allowed: true, course };
};

// @desc    Get all discussions for a course
// @route   GET /api/courses/:id/discussions
// @access  Private (Enrolled students and Instructors)
exports.getCourseDiscussions = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const access = await checkCourseAccess(courseId, req.user);
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        message: access.reason
      });
    }

    const discussions = await Discussion.find({ courseId })
      .populate('authorId', 'name email role avatar')
      .sort({ createdAt: -1 });

    // Enrich with replies count
    const enriched = await Promise.all(
      discussions.map(async (disc) => {
        const replyCount = await Reply.countDocuments({ discussionId: disc._id });
        return {
          ...disc.toObject(),
          replyCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enriched.length,
      discussions: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new discussion post / question
// @route   POST /api/courses/:id/discussions
// @access  Private (Enrolled students and Instructors)
exports.createDiscussion = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, content } = req.body;

    const access = await checkCourseAccess(courseId, req.user);
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        message: access.reason
      });
    }

    // TC11 Validation: Reject empty title or content
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Discussion title and content are required and cannot be empty'
      });
    }

    const discussion = await Discussion.create({
      courseId,
      authorId: req.user._id,
      title: title.trim(),
      content: content.trim()
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('authorId', 'name email role avatar');

    res.status(201).json({
      success: true,
      message: 'Discussion post created successfully',
      discussion: populatedDiscussion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get replies for a discussion thread
// @route   GET /api/discussions/:id/replies
// @access  Private
exports.getDiscussionReplies = async (req, res, next) => {
  try {
    const discussionId = req.params.id;

    const discussion = await Discussion.findById(discussionId)
      .populate('authorId', 'name email role avatar')
      .populate('courseId', 'title instructorId');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found'
      });
    }

    const replies = await Reply.find({ discussionId })
      .populate('authorId', 'name email role avatar')
      .sort({ createdAt: 1 }); // chronological order

    res.status(200).json({
      success: true,
      discussion,
      count: replies.length,
      replies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a reply to a discussion thread
// @route   POST /api/discussions/:id/replies
// @access  Private
exports.createReply = async (req, res, next) => {
  try {
    const discussionId = req.params.id;
    const { content } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion thread not found'
      });
    }

    // TC11 Validation: Reject empty reply
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message cannot be empty'
      });
    }

    const access = await checkCourseAccess(discussion.courseId, req.user);
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        message: access.reason
      });
    }

    const reply = await Reply.create({
      discussionId,
      authorId: req.user._id,
      content: content.trim()
    });

    // Update discussion updatedAt timestamp
    discussion.updatedAt = Date.now();
    await discussion.save();

    const populatedReply = await Reply.findById(reply._id)
      .populate('authorId', 'name email role avatar');

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      reply: populatedReply
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a discussion post
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const course = await Course.findById(discussion.courseId);
    const isAuthor = discussion.authorId.toString() === req.user._id.toString();
    const isInstructor = req.user.role === 'instructor' && course.instructorId.toString() === req.user._id.toString();

    if (!isAuthor && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    await Reply.deleteMany({ discussionId: discussion._id });
    await Discussion.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Discussion and replies deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
