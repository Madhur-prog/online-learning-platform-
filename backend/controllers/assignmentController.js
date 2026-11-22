const path = require('path');
const fs = require('fs');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    Get all assignments for a course
// @route   GET /api/courses/:id/assignments
// @access  Private (Authenticated users)
exports.getCourseAssignments = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const assignments = await Assignment.find({ courseId }).sort({ dueDate: 1 });

    // If student, attach submission status
    let enriched = assignments;
    if (req.user.role === 'student') {
      enriched = await Promise.all(
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
    }

    res.status(200).json({
      success: true,
      count: enriched.length,
      assignments: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private (Authenticated users)
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('courseId', 'title instructorId');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    let submission = null;
    if (req.user.role === 'student') {
      submission = await Submission.findOne({
        assignmentId: assignment._id,
        studentId: req.user._id
      });
    }

    res.status(200).json({
      success: true,
      assignment: {
        ...assignment.toObject(),
        submission,
        status: submission ? submission.status : 'Not Submitted'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assignment
// @route   POST /api/courses/:id/assignments
// @access  Private (Instructor only)
exports.createAssignment = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, description, dueDate, maxMarks } = req.body;

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
        message: 'Not authorized to create assignments for this course'
      });
    }

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and due date'
      });
    }

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      dueDate: new Date(dueDate),
      maxMarks: Number(maxMarks) || 100
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment (Upload file)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student only)
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid PDF or DOCX file to submit'
      });
    }

    // Determine status (Submitted vs Late)
    const isLate = new Date() > new Date(assignment.dueDate);
    const initialStatus = isLate ? 'Late' : 'Submitted';

    // Check if previous submission exists, if so update it or create new
    let submission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id
    });

    const ext = path.extname(req.file.originalname).toUpperCase().replace('.', '');

    if (submission) {
      // Remove old file if exists
      if (fs.existsSync(submission.filePath)) {
        try { fs.unlinkSync(submission.filePath); } catch (e) { /* ignore */ }
      }
      submission.filePath = req.file.path;
      submission.originalFileName = req.file.originalname;
      submission.fileType = ext;
      submission.fileSize = req.file.size;
      submission.status = initialStatus;
      submission.submittedAt = Date.now();
      await submission.save();
    } else {
      submission = await Submission.create({
        assignmentId,
        studentId: req.user._id,
        courseId: assignment.courseId,
        filePath: req.file.path,
        originalFileName: req.file.originalname,
        fileType: ext,
        fileSize: req.file.size,
        status: initialStatus,
        submittedAt: Date.now()
      });
    }

    res.status(200).json({
      success: true,
      message: isLate ? 'Assignment submitted (Marked as Late)' : 'Assignment submitted successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student submission status
// @route   GET /api/assignments/:id/status
// @access  Private (Student)
exports.getStudentSubmissionStatus = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id
    });

    res.status(200).json({
      success: true,
      assignment: {
        id: assignment._id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks
      },
      submission: submission || null,
      status: submission ? submission.status : 'Not Submitted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Instructor only)
exports.getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const course = await Course.findById(assignment.courseId);
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions for this course'
      });
    }

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email avatar')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      assignment,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade student submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Instructor only)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const submissionId = req.params.id;
    const { marks, feedback } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const assignment = await Assignment.findById(submission.assignmentId);
    const course = await Course.findById(assignment.courseId);

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grade this submission'
      });
    }

    if (marks === undefined || marks === null || isNaN(marks)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid numerical marks'
      });
    }

    const numMarks = Number(marks);
    if (numMarks < 0 || numMarks > assignment.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and maximum possible marks (${assignment.maxMarks})`
      });
    }

    submission.marks = numMarks;
    submission.feedback = feedback || '';
    submission.status = 'Graded';
    submission.gradedAt = Date.now();

    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download submission file
// @route   GET /api/submissions/:id/download
// @access  Private
exports.downloadSubmissionFile = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Access check: only the student who submitted or the course instructor can download
    const assignment = await Assignment.findById(submission.assignmentId);
    const course = await Course.findById(assignment.courseId);

    const isStudentOwner = req.user.role === 'student' && submission.studentId.toString() === req.user._id.toString();
    const isCourseInstructor = req.user.role === 'instructor' && course.instructorId.toString() === req.user._id.toString();

    if (!isStudentOwner && !isCourseInstructor) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot download this submission.'
      });
    }

    if (!fs.existsSync(submission.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(submission.filePath, submission.originalFileName || path.basename(submission.filePath));
  } catch (error) {
    next(error);
  }
};
