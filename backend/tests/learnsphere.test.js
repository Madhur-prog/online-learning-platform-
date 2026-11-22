const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../server');

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Discussion = require('../models/Discussion');

const { calculateQuizScore } = require('../services/quizScorer');
const { calculateBuggyQuizScore } = require('./fixtures/buggyQuizScorer');

let studentToken = '';
let instructorToken = '';
let studentUser = null;
let secondStudentUser = null;
let instructorUser = null;
let testCourse = null;
let testLesson = null;
let testQuiz = null;
let testAssignment = null;
let studentQuizAttempt = null;

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('LearnSphere Full-Stack API Test Suite (TC01 - TC12 & BUG-001)', () => {

  // ==========================================
  // AUTHENTICATION TESTS (TC01, TC07)
  // ==========================================
  describe('Authentication Module', () => {
    test('TC01: Student logs in with valid credentials -> Expected: Login successful', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@learnsphere.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('student');
      expect(res.body.user.email).toBe('student@learnsphere.com');

      studentToken = res.body.token;
      studentUser = res.body.user;
    });

    test('TC07 [Negative]: Login with incorrect password -> Expected: Authentication rejected', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@learnsphere.com',
          password: 'WrongPassword999!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    test('Setup: Instructor login & second student login for testing isolation', async () => {
      const instRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'instructor@learnsphere.com',
          password: 'Password123!'
        });
      expect(instRes.statusCode).toBe(200);
      instructorToken = instRes.body.token;
      instructorUser = instRes.body.user;

      const stud2Res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'priya@learnsphere.com',
          password: 'Password123!'
        });
      expect(stud2Res.statusCode).toBe(200);
      secondStudentUser = stud2Res.body.user;
    });
  });

  // ==========================================
  // COURSE ACCESS & ENROLLMENT (TC02, TC12)
  // ==========================================
  describe('Course Catalog & Enrollment Module', () => {
    beforeAll(async () => {
      testCourse = await Course.findOne({ title: 'Python Programming' });
      testLesson = await Lesson.findOne({ courseId: testCourse._id });
      testQuiz = await Quiz.findOne();
      testAssignment = await Assignment.findOne();
    });

    test('TC02: Student enrolls in a course -> Expected: Enrollment saved in database', async () => {
      // Remove any existing enrollment for this student in Python course to test cleanly
      await Enrollment.deleteMany({ studentId: studentUser.id, courseId: testCourse._id });

      const res = await request(app)
        .post(`/api/courses/${testCourse._id}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.enrollment.courseId.toString()).toBe(testCourse._id.toString());

      // Verify in MongoDB
      const saved = await Enrollment.findOne({ studentId: studentUser.id, courseId: testCourse._id });
      expect(saved).not.toBeNull();
    });

    test('TC12 [Negative]: Student tries to create an instructor-only course -> Expected: Access denied', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Course by Student',
          description: 'This should be blocked by RBAC middleware',
          category: 'Web Development'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  // ==========================================
  // LESSON ACCESS (TC03)
  // ==========================================
  describe('Lesson Module', () => {
    test('TC03: Student opens a video lesson -> Expected: Lesson loads successfully', async () => {
      const res = await request(app)
        .get(`/api/lessons/${testLesson._id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.lesson.title).toBe(testLesson.title);
      expect(res.body.lesson.videoUrl).toBeDefined();
    });
  });

  // ==========================================
  // QUIZ SUBMISSION & SCORING (TC04, TC08, TC10, BUG-001)
  // ==========================================
  describe('Quiz Module & BUG-001 Defect Correction', () => {
    test('TC04: Student submits valid quiz answers -> Expected: Correct score is calculated and stored', async () => {
      // Clean up previous attempts on this quiz for clean test
      await QuizAttempt.deleteMany({ studentId: studentUser.id, quizId: testQuiz._id });

      // Provide correct answers for Q1 (idx 1), Q2 (idx 2), Q3 (idx 0)
      const answers = [
        { questionIndex: 0, selectedOptionIndex: testQuiz.questions[0].correctOptionIndex },
        { questionIndex: 1, selectedOptionIndex: testQuiz.questions[1].correctOptionIndex },
        { questionIndex: 2, selectedOptionIndex: testQuiz.questions[2].correctOptionIndex }
      ];

      const res = await request(app)
        .post(`/api/quizzes/${testQuiz._id}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ answers });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.result.percentage).toBe(100);
      expect(res.body.result.passed).toBe(true);

      studentQuizAttempt = await QuizAttempt.findById(res.body.attemptId);
      expect(studentQuizAttempt).not.toBeNull();
    });

    test('TC08 [Negative]: Submit quiz without required answers -> Expected: Validation error', async () => {
      const res = await request(app)
        .post(`/api/quizzes/${testQuiz._id}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ answers: [] });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/answers are required/i);
    });

    test('TC10 [Negative]: Access another student private quiz result -> Expected: Access denied', async () => {
      // Student 2 (Priya) logs in and attempts to access Student 1 (Alex)'s quiz attempt
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'priya@learnsphere.com',
          password: 'Password123!'
        });
      const priyaToken = loginRes.body.token;

      const res = await request(app)
        .get(`/api/quizzes/attempts/${studentQuizAttempt._id}`)
        .set('Authorization', `Bearer ${priyaToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Access denied/i);
    });

    test('BUG-001 Regression Test: Weighted Quiz Score vs Buggy Equal-Weight Score', () => {
      // Reproduction scenario from Section 13:
      // Q1 = 2 marks, Q2 = 3 marks, Q3 = 5 marks (Total = 10 marks)
      // Student answers Q1 (2 marks) and Q3 (5 marks) correctly, but Q2 incorrectly.
      // Expected earned = 7/10 marks = 70%
      const sampleQuiz = {
        title: 'Weighted Evaluation Demo',
        passingPercentage: 60,
        questions: [
          { questionText: 'Q1', correctOptionIndex: 0, marks: 2 },
          { questionText: 'Q2', correctOptionIndex: 1, marks: 3 },
          { questionText: 'Q3', correctOptionIndex: 2, marks: 5 }
        ]
      };

      const submittedAnswers = [
        { questionIndex: 0, selectedOptionIndex: 0 }, // Correct (2 marks)
        { questionIndex: 1, selectedOptionIndex: 0 }, // Incorrect (0 marks)
        { questionIndex: 2, selectedOptionIndex: 2 }  // Correct (5 marks)
      ];

      // 1. Buggy calculation demonstrates defect: treats all 3 questions equally
      const buggyResult = calculateBuggyQuizScore(sampleQuiz, submittedAnswers);
      expect(buggyResult.percentage).toBe(66.67); // 2 correct out of 3 = 66.67% (INCORRECT!)

      // 2. Corrected implementation (active in LearnSphere):
      const correctedResult = calculateQuizScore(sampleQuiz, submittedAnswers);
      expect(correctedResult.score).toBe(7);
      expect(correctedResult.totalMarks).toBe(10);
      expect(correctedResult.percentage).toBe(70); // 7/10 * 100 = 70% (CORRECT!)
      expect(correctedResult.passed).toBe(true);
    });
  });

  // ==========================================
  // ASSIGNMENT UPLOAD & STATUS (TC05, TC09)
  // ==========================================
  describe('Assignment Module', () => {
    const dummyPdfPath = path.join(__dirname, 'dummy_test.pdf');
    const dummyTxtPath = path.join(__dirname, 'dummy_test.txt');

    beforeAll(() => {
      fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy content for test upload');
      fs.writeFileSync(dummyTxtPath, 'unsupported plain text file content');
    });

    afterAll(() => {
      if (fs.existsSync(dummyPdfPath)) fs.unlinkSync(dummyPdfPath);
      if (fs.existsSync(dummyTxtPath)) fs.unlinkSync(dummyTxtPath);
    });

    test('TC05: Student uploads a valid PDF assignment -> Expected: Submission successful', async () => {
      const res = await request(app)
        .post(`/api/assignments/${testAssignment._id}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('file', dummyPdfPath);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.submission).toBeDefined();
      expect(['Submitted', 'Late']).toContain(res.body.submission.status);
    });

    test('TC09 [Negative]: Upload an unsupported assignment file -> Expected: File rejected', async () => {
      const res = await request(app)
        .post(`/api/assignments/${testAssignment._id}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('file', dummyTxtPath);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid file type/i);
    });
  });

  // ==========================================
  // DISCUSSION FORUM MODULE (TC06, TC11)
  // (New Requirement added after Sprint 1)
  // ==========================================
  describe('Course Discussion Forum Module (Requirement Change)', () => {
    let createdDiscussionId = null;

    test('TC06: Student creates a discussion post -> Expected: Post appears in the course forum', async () => {
      // Student is enrolled in testCourse (Python Programming) from TC02
      const res = await request(app)
        .post(`/api/courses/${testCourse._id}/discussions`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'How do list comprehensions compare to map() in performance?',
          content: 'In Python 3, is a list comprehension faster or more idiomatic than map with a lambda?'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.discussion.title).toMatch(/list comprehensions/i);
      expect(res.body.discussion.authorId._id.toString()).toBe(studentUser.id);

      createdDiscussionId = res.body.discussion._id;

      // Verify thread listing
      const listRes = await request(app)
        .get(`/api/courses/${testCourse._id}/discussions`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(listRes.statusCode).toBe(200);
      expect(listRes.body.discussions.some(d => d._id.toString() === createdDiscussionId.toString())).toBe(true);
    });

    test('TC11 [Negative]: Submit an empty discussion message -> Expected: Validation error', async () => {
      const res = await request(app)
        .post(`/api/courses/${testCourse._id}/discussions`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: '',
          content: '   '
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cannot be empty/i);
    });
  });
});
