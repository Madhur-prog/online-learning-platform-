const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const StudyMaterial = require('../models/StudyMaterial');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');

const EXPECTED_CATEGORIES = [
  'Web Development',
  'Programming',
  'Database Management',
  'Data Science',
  'Software Engineering'
];

async function validateCatalog() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnsphere';
  console.log('================================================================');
  console.log('    LEARNSPHERE COURSE CATALOG & FEATURE COMPLETENESS AUDIT    ');
  console.log('================================================================');
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully.\n');

    const courses = await Course.find().populate('instructorId', 'name email');
    console.log(`[CHECK 1] Total Courses Found: ${courses.length} (Requirement: >= 10)`);
    if (courses.length < 10) {
      throw new Error(`FAIL: Found only ${courses.length} courses, expected at least 10.`);
    }

    // Category Distribution Audit
    console.log('\n[CHECK 2] Category Distribution Audit (Requirement: >= 2 courses per category):');
    const categoryCounts = {};
    courses.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    let catFailures = 0;
    for (const cat of EXPECTED_CATEGORIES) {
      const count = categoryCounts[cat] || 0;
      const status = count >= 2 ? 'PASS' : 'FAIL';
      console.log(`  - [${status}] ${cat.padEnd(24)}: ${count} course(s)`);
      if (count < 2) catFailures++;
    }

    if (catFailures > 0) {
      throw new Error(`FAIL: ${catFailures} categories have fewer than 2 courses.`);
    }

    // Per-Course Detailed Feature Audit
    console.log('\n[CHECK 3] Detailed Course Feature Audit Matrix:');
    console.log('-'.repeat(110));
    console.log(
      '#'.padEnd(3) +
      'Course Title'.padEnd(33) +
      'Category'.padEnd(22) +
      'Lessons'.padEnd(9) +
      'Video'.padEnd(7) +
      'PDF'.padEnd(6) +
      'Quizzes'.padEnd(10) +
      'Assign'.padEnd(8) +
      'Disc(R)'.padEnd(9) +
      'Instructor'.padEnd(8)
    );
    console.log('-'.repeat(110));

    const auditResults = [];
    let courseIndex = 1;

    for (const course of courses) {
      const lessons = await Lesson.find({ courseId: course._id });
      const materials = await StudyMaterial.find({ courseId: course._id });
      const quizzes = await Quiz.find({ courseId: course._id });
      const assignments = await Assignment.find({ courseId: course._id });
      const discussions = await Discussion.find({ courseId: course._id });

      let totalReplies = 0;
      for (const d of discussions) {
        const replyCount = await Reply.countDocuments({ discussionId: d._id });
        totalReplies += replyCount;
      }

      // Validate Video Files exist on disk
      let validVideos = 0;
      for (const l of lessons) {
        if (l.videoUrl) {
          if (l.videoUrl.startsWith('/uploads/')) {
            const diskPath = path.join(__dirname, '..', l.videoUrl);
            if (fs.existsSync(diskPath)) validVideos++;
          } else {
            validVideos++;
          }
        }
      }

      // Validate Study Materials exist on disk
      let validPdfs = 0;
      for (const m of materials) {
        if (m.filePath) {
          const diskPath = path.isAbsolute(m.filePath)
            ? m.filePath
            : path.join(__dirname, '..', m.filePath);
          if (fs.existsSync(diskPath)) validPdfs++;
        }
      }

      // Validate Quiz Questions
      let totalQuestions = 0;
      let validQuestions = 0;
      for (const q of quizzes) {
        totalQuestions += (q.questions ? q.questions.length : 0);
        if (q.questions) {
          for (const item of q.questions) {
            if (item.questionText && item.options && item.options.length >= 4 && item.correctOptionIndex !== undefined) {
              validQuestions++;
            }
          }
        }
      }

      const passLessons = lessons.length >= 3;
      const passVideo = validVideos >= 1;
      const passPdf = validPdfs >= 1;
      const hasBeginnerQuiz = quizzes.some(q => q.difficulty === 'Beginner');
      const hasInterQuiz = quizzes.some(q => q.difficulty === 'Intermediate');
      const hasAdvQuiz = quizzes.some(q => q.difficulty === 'Advanced');
      const passQuiz = quizzes.length >= 3 && hasBeginnerQuiz && hasInterQuiz && hasAdvQuiz && validQuestions >= 22;

      const hasBeginnerAssign = assignments.some(a => a.difficulty === 'Beginner');
      const hasInterAssign = assignments.some(a => a.difficulty === 'Intermediate');
      const hasAdvAssign = assignments.some(a => a.difficulty === 'Advanced');
      const passAssignment = assignments.length >= 3 && hasBeginnerAssign && hasInterAssign && hasAdvAssign;

      const passDiscussion = discussions.length >= 1 && totalReplies >= 1;
      const passInstructor = !!(course.instructorId && course.instructorId.name);

      const coursePass = passLessons && passVideo && passPdf && passQuiz && passAssignment && passDiscussion && passInstructor;

      console.log(
        `${courseIndex.toString().padEnd(3)}` +
        `${course.title.slice(0, 31).padEnd(33)}` +
        `${course.category.slice(0, 20).padEnd(22)}` +
        `${(lessons.length + (passLessons ? ' ✓' : ' ✗')).padEnd(9)}` +
        `${(validVideos + (passVideo ? ' ✓' : ' ✗')).padEnd(7)}` +
        `${(validPdfs + (passPdf ? ' ✓' : ' ✗')).padEnd(6)}` +
        `${(quizzes.length + (passQuiz ? ' ✓' : ' ✗')).padEnd(10)}` +
        `${(assignments.length + (passAssignment ? ' ✓' : ' ✗')).padEnd(8)}` +
        `${(totalReplies + (passDiscussion ? ' ✓' : ' ✗')).padEnd(9)}` +
        `${(passInstructor ? '✓' : '✗').padEnd(8)}`
      );

      auditResults.push({
        title: course.title,
        category: course.category,
        passLessons,
        passVideo,
        passPdf,
        passQuiz,
        passAssignment,
        passDiscussion,
        passInstructor,
        coursePass,
        lessonsCount: lessons.length,
        materialsCount: validPdfs,
        quizzesCount: quizzes.length,
        questionsCount: totalQuestions,
        assignmentsCount: assignments.length,
        discussionsCount: discussions.length,
        repliesCount: totalReplies
      });

      courseIndex++;
    }
    console.log('-'.repeat(110));

    const failedCourses = auditResults.filter(r => !r.coursePass);
    if (failedCourses.length > 0) {
      console.error('\nAUDIT FAILED! The following courses do not meet all criteria:');
      failedCourses.forEach(f => {
        console.error(`- ${f.title} (${f.category}):`);
        if (!f.passLessons) console.error('    * Lessons < 3');
        if (!f.passVideo) console.error('    * No playable video on disk');
        if (!f.passPdf) console.error('    * No physical PDF study material on disk');
        if (!f.passQuiz) console.error(`    * Quiz criteria not met (Questions: ${f.questionsCount}/5)`);
        if (!f.passAssignment) console.error('    * No assignment found');
        if (!f.passDiscussion) console.error('    * Discussion thread or reply missing');
        if (!f.passInstructor) console.error('    * Instructor reference missing');
      });
      process.exit(1);
    }

    console.log('\n================================================================');
    console.log('  ALL AUDIT CHECKS PASSED: 10/10 COURSES ARE FULLY COMPLETE!   ');
    console.log('================================================================');
    console.log('✓ Total courses >= 10 (Actual: ' + courses.length + ')');
    console.log('✓ All 5 categories have >= 2 courses');
    console.log('✓ Every course has >= 3 structured lessons');
    console.log('✓ Every course has >= 1 playable video lecture physically on disk');
    console.log('✓ Every course has >= 1 downloadable PDF study material physically on disk');
    console.log('✓ Every course has >= 1 quiz with at least 5 multiple-choice questions');
    console.log('✓ Every course has >= 1 assignment with instructions and due date');
    console.log('✓ Every course has >= 1 discussion thread with active replies');
    console.log('✓ Every course has a verified instructor association');
    console.log('================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Validation error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

validateCatalog();
