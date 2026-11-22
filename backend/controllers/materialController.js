const path = require('path');
const fs = require('fs');
const StudyMaterial = require('../models/StudyMaterial');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get all study materials for a course
// @route   GET /api/courses/:id/materials
// @access  Public (or authenticated)
exports.getCourseMaterials = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const materials = await StudyMaterial.find({ courseId })
      .populate('lessonId', 'title order')
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get materials for a lesson
// @route   GET /api/lessons/:id/materials
// @access  Public (or authenticated)
exports.getLessonMaterials = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const materials = await StudyMaterial.find({ lessonId }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      materials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload new study material
// @route   POST /api/courses/:id/materials
// @access  Private (Instructor only)
exports.uploadMaterial = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { title, lessonId } = req.body;

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
        message: 'Not authorized to upload materials for this course'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file (PDF, DOCX, or PPTX)'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Material title is required'
      });
    }

    const ext = path.extname(req.file.originalname).toUpperCase().replace('.', '');
    const fileSizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

    const material = await StudyMaterial.create({
      courseId,
      lessonId: lessonId || null,
      title,
      filePath: req.file.path,
      originalFileName: req.file.originalname,
      fileType: ext,
      fileSize: fileSizeInMB
    });

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      material
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download study material
// @route   GET /api/materials/:id/download
// @access  Private (Authenticated users)
exports.downloadMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    if (!fs.existsSync(material.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(material.filePath, material.originalFileName || path.basename(material.filePath));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study material
// @route   DELETE /api/materials/:id
// @access  Private (Instructor only)
exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found'
      });
    }

    const course = await Course.findById(material.courseId);
    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this material'
      });
    }

    if (fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
