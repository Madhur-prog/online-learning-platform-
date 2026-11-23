const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const QuizAttempt = require('../models/QuizAttempt');
const allAssessments = require('../seed/allAssessments');

async function seedExpandedAssessments() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnsphere';
  console.log('================================================================');
  console.log('  LEARNSPHERE ASSESSMENT EXPANSION: 30 QUIZZES & 30 ASSIGNMENTS ');
  console.log('================================================================');
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.\n');

    for (const cData of allAssessments) {
      const course = await Course.findOne({ title: cData.courseTitle });
      if (!course) {
        console.error(`[WARN] Course not found in database: "${cData.courseTitle}"`);
        continue;
      }

      console.log(`\nProcessing Course: [${course.category}] "${course.title}"`);

      // 1. Quizzes: Ensure Beginner, Intermediate, Advanced exist
      for (const qData of cData.quizzes) {
        let quiz = await Quiz.findOne({
          courseId: course._id,
          difficulty: qData.difficulty
        });

        if (quiz) {
          quiz.passingPercentage = qData.passingPercentage || 60;
          if (!quiz.questions || quiz.questions.length < qData.questions.length) {
            quiz.questions = qData.questions;
          }
          await quiz.save();
          console.log(`  = Preserved Quiz: [${quiz.difficulty}] "${quiz.title}" (${quiz.questions.length} Qs)`);
        } else {
          quiz = await Quiz.create({
            courseId: course._id,
            title: qData.title,
            description: qData.description,
            difficulty: qData.difficulty,
            passingPercentage: qData.passingPercentage,
            questions: qData.questions
          });
          console.log(`  + Created Quiz: [${quiz.difficulty}] "${quiz.title}" (${quiz.questions.length} Qs)`);
        }
      }

      // 2. Assignments: Ensure Beginner (20), Intermediate (30), Advanced (50) exist
      for (const aData of cData.assignments) {
        let assign = await Assignment.findOne({
          courseId: course._id,
          difficulty: aData.difficulty
        });

        if (assign) {
          console.log(`  = Preserved Assignment: [${assign.difficulty}] "${assign.title}" (Max Marks: ${assign.maxMarks})`);
        } else {
          assign = await Assignment.create({
            courseId: course._id,
            title: aData.title,
            description: aData.description,
            difficulty: aData.difficulty,
            dueDate: new Date(Date.now() + aData.dueDateDays * 24 * 60 * 60 * 1000),
            maxMarks: aData.maxMarks
          });
          console.log(`  + Created Assignment: [${assign.difficulty}] "${assign.title}" (Max Marks: ${assign.maxMarks})`);
        }
      }
    }

    console.log('\n================================================================');
    console.log('              ASSESSMENT EXPANSION SUMMARY                      ');
    console.log('================================================================');
    const finalCourses = await Course.find();
    let completeCourses = 0;

    for (const fc of finalCourses) {
      const qList = await Quiz.find({ courseId: fc._id }).sort({ createdAt: 1 });
      const aList = await Assignment.find({ courseId: fc._id }).sort({ dueDate: 1 });
      const has3Quizzes = qList.length === 3;
      const has3Assigns = aList.length === 3;
      if (has3Quizzes && has3Assigns) completeCourses++;

      console.log(`Course: "${fc.title}"`);
      console.log(`  Quizzes (${qList.length}/3):`);
      qList.forEach(q => console.log(`    - [${q.difficulty}] "${q.title}" (${q.questions.length} Qs, ${(q.questions.reduce((s, x) => s + (x.marks || 1), 0))} marks)`));
      console.log(`  Assignments (${aList.length}/3):`);
      aList.forEach(a => console.log(`    - [${a.difficulty}] "${a.title}" (Max: ${a.maxMarks})`));
    }

    const totalQuizzesInDb = await Quiz.countDocuments();
    const totalAssignmentsInDb = await Assignment.countDocuments();
    const totalSubmissionsInDb = await Submission.countDocuments();
    const totalAttemptsInDb = await QuizAttempt.countDocuments();

    console.log('\n================================================================');
    console.log(`Total Courses: ${finalCourses.length}`);
    console.log(`Total Quizzes in Database: ${totalQuizzesInDb} (Requirement: 30)`);
    console.log(`Total Assignments in Database: ${totalAssignmentsInDb} (Requirement: 30)`);
    console.log(`Preserved Student Submissions: ${totalSubmissionsInDb}`);
    console.log(`Preserved Student Quiz Attempts: ${totalAttemptsInDb}`);
    console.log(`Courses Meeting 3x3 Assessment Requirement: ${completeCourses}/${finalCourses.length}`);
    console.log('================================================================\n');

    if (totalQuizzesInDb !== 30 || totalAssignmentsInDb !== 30 || completeCourses !== 10) {
      console.error(`Assessment expansion failed to meet 30 quizzes and 30 assignments (Found ${totalQuizzesInDb} quizzes, ${totalAssignmentsInDb} assignments).`);
      process.exit(1);
    } else {
      console.log('SUCCESS: All 10 courses now contain exactly 3 quizzes and 3 assignments!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedExpandedAssessments();
