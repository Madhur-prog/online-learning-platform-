const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');

async function inspect() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnsphere');
  const courses = await Course.find();
  console.log(`Found ${courses.length} courses in database.`);
  for (const c of courses) {
    const qList = await Quiz.find({ courseId: c._id });
    const aList = await Assignment.find({ courseId: c._id });
    console.log(`\nCourse: "${c.title}"`);
    console.log(`  Quizzes (${qList.length}):`);
    qList.forEach(q => console.log(`    - [${q.difficulty || 'N/A'}] "${q.title}" (${q.questions.length} Qs, ${q.passingPercentage}%)`));
    console.log(`  Assignments (${aList.length}):`);
    aList.forEach(a => console.log(`    - [${a.difficulty || 'N/A'}] "${a.title}" (Max Marks: ${a.maxMarks})`));
  }
  await mongoose.disconnect();
}
inspect();
