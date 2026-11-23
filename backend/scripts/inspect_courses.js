const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkCourses() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere');
  const Course = require(path.join(__dirname, '..', 'models', 'Course'));
  const Lesson = require(path.join(__dirname, '..', 'models', 'Lesson'));
  const Quiz = require(path.join(__dirname, '..', 'models', 'Quiz'));
  const Assignment = require(path.join(__dirname, '..', 'models', 'Assignment'));
  const StudyMaterial = require(path.join(__dirname, '..', 'models', 'StudyMaterial'));
  const Discussion = require(path.join(__dirname, '..', 'models', 'Discussion'));

  const courses = await Course.find();
  console.log('Total courses in DB:', courses.length);
  for (const c of courses) {
    const lessons = await Lesson.countDocuments({ courseId: c._id });
    const quizzes = await Quiz.countDocuments({ courseId: c._id });
    const assignments = await Assignment.countDocuments({ courseId: c._id });
    const materials = await StudyMaterial.countDocuments({ courseId: c._id });
    const discussions = await Discussion.countDocuments({ courseId: c._id });
    console.log(`[${c.category}] "${c.title}" (ID: ${c._id}) -> Lessons: ${lessons}, Quizzes: ${quizzes}, Assignments: ${assignments}, Materials: ${materials}, Discussions: ${discussions}`);
  }
  await mongoose.disconnect();
}
checkCourses().catch(console.error);
