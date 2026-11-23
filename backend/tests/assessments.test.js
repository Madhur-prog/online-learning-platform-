const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../server');

const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const QuizAttempt = require('../models/QuizAttempt');

describe('LearnSphere 3 Quizzes & 3 Assignments Expansion Test Suite', () => {
  let studentToken = '';
  let instructorToken = '';
  let allCourses = [];

  const EXPECTED_COURSES = [
    'JavaScript Fundamentals',
    'Web Development Basics',
    'Python Programming',
    'Java Programming',
    'Database Management Systems',
    'MongoDB Fundamentals',
    'Introduction to Data Science',
    'Machine Learning Basics',
    'Software Engineering Fundamentals',
    'Agile Software Development'
  ];

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Authenticate student & instructor
    const studRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@learnsphere.com', password: 'Password123!' });
    studentToken = studRes.body.token;

    const instRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'instructor@learnsphere.com', password: 'Password123!' });
    instructorToken = instRes.body.token;

    allCourses = await Course.find({ title: { $in: EXPECTED_COURSES } });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test('Database contains all 10 target courses across 5 categories', () => {
    expect(allCourses.length).toBe(10);
    const titles = allCourses.map(c => c.title);
    EXPECTED_COURSES.forEach(title => {
      expect(titles).toContain(title);
    });
  });

  test('Database contains exactly 30 quizzes and 30 assignments in total', async () => {
    const totalQuizzes = await Quiz.countDocuments({});
    const totalAssignments = await Assignment.countDocuments({});
    expect(totalQuizzes).toBe(30);
    expect(totalAssignments).toBe(30);
  });

  test('Every course has exactly 3 quizzes with correct difficulty, question counts, and 4 options each', async () => {
    for (const course of allCourses) {
      const quizzes = await Quiz.find({ courseId: course._id }).sort({ createdAt: 1 });
      expect(quizzes.length).toBe(3);

      const difficulties = quizzes.map(q => q.difficulty);
      expect(difficulties).toContain('Beginner');
      expect(difficulties).toContain('Intermediate');
      expect(difficulties).toContain('Advanced');

      const beginnerQuiz = quizzes.find(q => q.difficulty === 'Beginner');
      const intermediateQuiz = quizzes.find(q => q.difficulty === 'Intermediate');
      const advancedQuiz = quizzes.find(q => q.difficulty === 'Advanced');

      // Verify question counts
      expect(beginnerQuiz.questions.length).toBe(5);
      expect(intermediateQuiz.questions.length).toBe(7);
      expect(advancedQuiz.questions.length).toBe(10);

      // Verify each quiz has 60% passing percentage and questions have 4 options and valid correctOptionIndex
      [beginnerQuiz, intermediateQuiz, advancedQuiz].forEach(quiz => {
        expect(quiz.passingPercentage).toBe(60);
        quiz.questions.forEach(q => {
          expect(q.options.length).toBe(4);
          expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctOptionIndex).toBeLessThan(4);
          expect(typeof q.questionText).toBe('string');
          expect(q.questionText.trim().length).toBeGreaterThan(0);
        });
      });
    }
  });

  test('Every course has exactly 3 assignments with correct difficulty and maxMarks', async () => {
    for (const course of allCourses) {
      const assignments = await Assignment.find({ courseId: course._id }).sort({ createdAt: 1 });
      expect(assignments.length).toBe(3);

      const difficulties = assignments.map(a => a.difficulty);
      expect(difficulties).toContain('Beginner');
      expect(difficulties).toContain('Intermediate');
      expect(difficulties).toContain('Advanced');

      const beginnerAssign = assignments.find(a => a.difficulty === 'Beginner');
      const intermediateAssign = assignments.find(a => a.difficulty === 'Intermediate');
      const advancedAssign = assignments.find(a => a.difficulty === 'Advanced');

      expect(beginnerAssign.maxMarks).toBe(20);
      expect(intermediateAssign.maxMarks).toBeGreaterThanOrEqual(30);
      expect(advancedAssign.maxMarks).toBe(50);

      [beginnerAssign, intermediateAssign, advancedAssign].forEach(assign => {
        expect(assign.description).toBeDefined();
        expect(assign.title).toBeDefined();
        expect(assign.dueDate).toBeDefined();
        expect(assign.difficulty).toBeDefined();
      });
    }
  });

  test('API GET /api/courses/:id/quizzes returns 3 quizzes and hides answers from students', async () => {
    const course = allCourses[0];
    const res = await request(app)
      .get(`/api/courses/${course._id}/quizzes`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quizzes.length).toBe(3);

    res.body.quizzes.forEach(quiz => {
      expect(quiz.totalMarks).toBeGreaterThan(0);
      quiz.questions.forEach(q => {
        expect(q.correctOptionIndex).toBeUndefined();
        expect(q.explanation).toBeUndefined();
      });
    });
  });

  test('API GET /api/courses/:id returns enriched quizzes (3) and assignments (3) for student', async () => {
    const course = allCourses[0];
    const res = await request(app)
      .get(`/api/courses/${course._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.course.quizzes.length).toBe(3);
    expect(res.body.course.assignments.length).toBe(3);

    // Each quiz should have hasAttempted indicator and difficulty
    res.body.course.quizzes.forEach(q => {
      expect(q).toHaveProperty('hasAttempted');
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(q.difficulty);
    });

    // Each assignment should have status indicator and difficulty
    res.body.course.assignments.forEach(a => {
      expect(a).toHaveProperty('status');
      expect(['Beginner', 'Intermediate', 'Advanced']).toContain(a.difficulty);
    });
  });

  test('Submitting Assignment 1 does NOT alter the Not Submitted status of Assignment 2 or 3', async () => {
    // Test on Python Programming course
    const pyCourse = allCourses.find(c => c.title === 'Python Programming');
    const pyAssignments = await Assignment.find({ courseId: pyCourse._id }).sort({ maxMarks: 1 });
    const assign1 = pyAssignments.find(a => a.difficulty === 'Beginner');
    const assign2 = pyAssignments.find(a => a.difficulty === 'Intermediate');
    const assign3 = pyAssignments.find(a => a.difficulty === 'Advanced');

    // Create a mock upload file
    const fixtureDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixtureDir)) {
      fs.mkdirSync(fixtureDir, { recursive: true });
    }
    const testPdfPath = path.join(fixtureDir, 'test_assessment_submission.pdf');
    if (!fs.existsSync(testPdfPath)) {
      fs.writeFileSync(testPdfPath, '%PDF-1.4 Mock PDF submission for testing isolation');
    }

    // Submit assignment 1 as student
    const uploadRes = await request(app)
      .post(`/api/assignments/${assign1._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('file', testPdfPath);

    expect([200, 201]).toContain(uploadRes.status);
    expect(uploadRes.body.success).toBe(true);

    // Now check course details via API for student
    const courseRes = await request(app)
      .get(`/api/courses/${pyCourse._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(courseRes.status).toBe(200);
    const enrichedAssignments = courseRes.body.course.assignments;

    const enrichedAssign1 = enrichedAssignments.find(a => a._id.toString() === assign1._id.toString());
    const enrichedAssign2 = enrichedAssignments.find(a => a._id.toString() === assign2._id.toString());
    const enrichedAssign3 = enrichedAssignments.find(a => a._id.toString() === assign3._id.toString());

    expect(enrichedAssign1.status).toBe('Submitted');
    expect(enrichedAssign2.status).toBe('Not Submitted');
    expect(enrichedAssign3.status).toBe('Not Submitted');
  });
});
