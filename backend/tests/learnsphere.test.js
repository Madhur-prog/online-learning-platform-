const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = require('../server');

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const StudyMaterial = require('../models/StudyMaterial');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');

const { calculateQuizScore } = require('../services/quizScorer');
const { calculateBuggyQuizScore } = require('./fixtures/buggyQuizScorer');

let studentToken = '';
let instructorToken = '';
let secondStudentToken = '';
let studentUser = null;
let instructorUser = null;
let secondStudentUser = null;

let jsCourse = null;
let jsLesson = null;
let jsMaterial = null;
let jsQuiz = null;
let jsAssignment = null;
let studentSubmission = null;
let studentQuizAttempt = null;

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  // Retrieve seed entities
  jsCourse = await Course.findOne({ title: 'JavaScript Fundamentals' });
  jsLesson = await Lesson.findOne({ courseId: jsCourse._id }).sort({ order: 1 });
  jsMaterial = await StudyMaterial.findOne({ courseId: jsCourse._id });
  jsQuiz = await Quiz.findOne({ courseId: jsCourse._id });
  jsAssignment = await Assignment.findOne({ courseId: jsCourse._id });

  // Authenticate student & instructor
  const studRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'student@learnsphere.com', password: 'Password123!' });
  studentToken = studRes.body.token;
  studentUser = studRes.body.user;

  const instRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'instructor@learnsphere.com', password: 'Password123!' });
  instructorToken = instRes.body.token;
  instructorUser = instRes.body.user;

  const secStudRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'priya@learnsphere.com', password: 'Password123!' });
  secondStudentToken = secStudRes.body.token;
  secondStudentUser = secStudRes.body.user;

  // Ensure student1 is enrolled in jsCourse
  await Enrollment.deleteMany({ studentId: studentUser.id, courseId: jsCourse._id });
  await Enrollment.create({
    studentId: studentUser.id,
    courseId: jsCourse._id,
    progress: 0,
    completedLessons: []
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('LearnSphere External Jury Evaluation Test Suite (TC01 - TC15)', () => {

  // ========================================================
  // TC01: Enrolled student opens video lesson
  // ========================================================
  test('TC01: Enrolled student opens video lesson -> Expected: Lesson loads successfully with playable video URL', async () => {
    const res = await request(app)
      .get(`/api/lessons/${jsLesson._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.lesson).toBeDefined();
    expect(res.body.lesson.title).toBe(jsLesson.title);
    expect(res.body.lesson.videoUrl).toBeDefined();
    expect(typeof res.body.lesson.videoUrl).toBe('string');
  });

  // ========================================================
  // TC02: Student retrieves study material metadata
  // ========================================================
  test('TC02: Student retrieves study material metadata -> Expected: Returns list of materials with metadata', async () => {
    const res = await request(app)
      .get(`/api/courses/${jsCourse._id}/materials`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.materials)).toBe(true);
    expect(res.body.materials.length).toBeGreaterThan(0);

    const firstMat = res.body.materials[0];
    expect(firstMat.title).toBeDefined();
    expect(firstMat.fileType).toBeDefined();
    expect(firstMat.fileSize).toBeDefined();
    expect(firstMat.filePath).toBeDefined();
  });

  // ========================================================
  // TC03: Student downloads PDF
  // ========================================================
  test('TC03: Student downloads PDF -> Expected: Serves PDF file stream with attachment disposition', async () => {
    const res = await request(app)
      .get(`/api/materials/${jsMaterial._id}/download`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment/i);
    expect(res.headers['content-disposition']).toMatch(/\.pdf/i);
  });

  // ========================================================
  // TC04: Student retrieves quiz questions (answers hidden)
  // ========================================================
  test('TC04: Student retrieves quiz questions -> Expected: Questions returned with 4 options and answers hidden', async () => {
    // Delete any prior attempt to test clean retrieval
    await QuizAttempt.deleteMany({ studentId: studentUser.id, quizId: jsQuiz._id });

    const res = await request(app)
      .get(`/api/quizzes/${jsQuiz._id}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.quiz.questions.length).toBeGreaterThanOrEqual(5);

    // Verify all 5 questions have 4 options and NO correctOptionIndex/explanation leaked
    res.body.quiz.questions.forEach((q) => {
      expect(q.questionText).toBeDefined();
      expect(q.options.length).toBe(4);
      expect(q.correctOptionIndex).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    });
  });

  // ========================================================
  // TC05: Student submits valid quiz answers
  // ========================================================
  test('TC05: Student submits valid quiz answers -> Expected: Quiz evaluated and score stored in database', async () => {
    const answers = jsQuiz.questions.map((q, idx) => ({
      questionIndex: idx,
      selectedOptionIndex: q.correctOptionIndex
    }));

    const res = await request(app)
      .post(`/api/quizzes/${jsQuiz._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.attemptId).toBeDefined();
    expect(res.body.result.percentage).toBe(100);
    expect(res.body.result.passed).toBe(true);

    studentQuizAttempt = await QuizAttempt.findById(res.body.attemptId);
    expect(studentQuizAttempt).not.toBeNull();
  });

  // ========================================================
  // TC06: Backend calculates correct score (BUG-001 weighted)
  // ========================================================
  test('TC06: Backend calculates correct score (BUG-001 weighted marks) -> Expected: Weighted percentage calculation', () => {
    // Reproduction test case:
    // Q1=1 mark, Q2=2 marks, Q3=2 marks, Q4=2 marks, Q5=3 marks. Total = 10 marks.
    // Student answers Q1 (1 mark), Q2 (2 marks), and Q5 (3 marks) correctly.
    // Total marks earned = 1 + 2 + 3 = 6 marks out of 10 = 60%.
    const sampleQuiz = {
      title: 'Weighted Scoring Evaluation',
      passingPercentage: 60,
      questions: [
        { questionText: 'Q1', correctOptionIndex: 0, marks: 1 },
        { questionText: 'Q2', correctOptionIndex: 1, marks: 2 },
        { questionText: 'Q3', correctOptionIndex: 2, marks: 2 },
        { questionText: 'Q4', correctOptionIndex: 3, marks: 2 },
        { questionText: 'Q5', correctOptionIndex: 1, marks: 3 }
      ]
    };

    const submittedAnswers = [
      { questionIndex: 0, selectedOptionIndex: 0 }, // Correct (1 mark)
      { questionIndex: 1, selectedOptionIndex: 1 }, // Correct (2 marks)
      { questionIndex: 2, selectedOptionIndex: 0 }, // Incorrect (0 marks)
      { questionIndex: 3, selectedOptionIndex: 0 }, // Incorrect (0 marks)
      { questionIndex: 4, selectedOptionIndex: 1 }  // Correct (3 marks)
    ];

    const result = calculateQuizScore(sampleQuiz, submittedAnswers);
    expect(result.score).toBe(6);
    expect(result.totalMarks).toBe(10);
    expect(result.percentage).toBe(60);
    expect(result.passed).toBe(true);
  });

  // ========================================================
  // TC07: Student submits incomplete quiz according to policy
  // ========================================================
  test('TC07: Student submits incomplete quiz according to policy -> Expected: Evaluates answered questions and computes score against total', async () => {
    // Only answer 2 out of 5 questions
    const incompleteAnswers = [
      { questionIndex: 0, selectedOptionIndex: jsQuiz.questions[0].correctOptionIndex },
      { questionIndex: 1, selectedOptionIndex: jsQuiz.questions[1].correctOptionIndex }
    ];

    const res = await request(app)
      .post(`/api/quizzes/${jsQuiz._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers: incompleteAnswers });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.totalMarks).toBe(10);
    expect(res.body.result.score).toBe(jsQuiz.questions[0].marks + jsQuiz.questions[1].marks);
    expect(res.body.result.percentage).toBeLessThan(100);
  });

  // ========================================================
  // TC08: Student uploads valid PDF assignment
  // ========================================================
  test('TC08: Student uploads valid PDF assignment -> Expected: Submission record created with status', async () => {
    const dummyPdf = path.join(__dirname, 'valid_submission.pdf');
    fs.writeFileSync(dummyPdf, '%PDF-1.4 sample submission document content');

    const res = await request(app)
      .post(`/api/assignments/${jsAssignment._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('file', dummyPdf);

    if (fs.existsSync(dummyPdf)) fs.unlinkSync(dummyPdf);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.submission).toBeDefined();
    expect(['Submitted', 'Late']).toContain(res.body.submission.status);

    studentSubmission = res.body.submission;
  });

  // ========================================================
  // TC09: Student attempts to upload unsupported file
  // ========================================================
  test('TC09: Student attempts to upload unsupported file -> Expected: Rejected with HTTP 400', async () => {
    const dummyTxt = path.join(__dirname, 'unsupported.txt');
    fs.writeFileSync(dummyTxt, 'plain text is not supported');

    const res = await request(app)
      .post(`/api/assignments/${jsAssignment._id}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('file', dummyTxt);

    if (fs.existsSync(dummyTxt)) fs.unlinkSync(dummyTxt);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid file type/i);
  });

  // ========================================================
  // TC10: Student retrieves assignment status
  // ========================================================
  test('TC10: Student retrieves assignment status -> Expected: Returns assignment details and submission status', async () => {
    const res = await request(app)
      .get(`/api/assignments/${jsAssignment._id}/status`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment.title).toBe(jsAssignment.title);
    expect(res.body.submission).not.toBeNull();
    expect(res.body.status).toBe(studentSubmission.status);
  });

  // ========================================================
  // TC11: Instructor grades assignment
  // ========================================================
  test('TC11: Instructor grades assignment -> Expected: Marks and feedback saved, status updated to Graded', async () => {
    const res = await request(app)
      .put(`/api/submissions/${studentSubmission._id}/grade`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        marks: 95,
        feedback: 'Outstanding implementation of event delegation and state management.'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.submission.marks).toBe(95);
    expect(res.body.submission.status).toBe('Graded');
    expect(res.body.submission.feedback).toMatch(/Outstanding/i);
  });

  // ========================================================
  // TC12: Student views graded assignment results
  // ========================================================
  test('TC12: Student views graded assignment results -> Expected: Graded status, marks, and feedback visible', async () => {
    const res = await request(app)
      .get(`/api/assignments/${jsAssignment._id}/status`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('Graded');
    expect(res.body.submission.marks).toBe(95);
    expect(res.body.submission.feedback).toMatch(/Outstanding/i);
  });

  // ========================================================
  // TC13: Unauthorized student attempts to access protected content
  // ========================================================
  test('TC13: Unauthorized student attempts to access protected content -> Expected: Access rejected with 403 or 401', async () => {
    // Student 2 attempts to view Student 1's private quiz attempt
    const res = await request(app)
      .get(`/api/quizzes/attempts/${studentQuizAttempt._id}`)
      .set('Authorization', `Bearer ${secondStudentToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/access denied/i);

    // Request with no token
    const noTokenRes = await request(app)
      .get(`/api/assignments/${jsAssignment._id}/status`);

    expect(noTokenRes.statusCode).toBe(401);
  });

  // ========================================================
  // TC14: Discussion forum and replies work
  // ========================================================
  test('TC14: Discussion forum and replies work -> Expected: Student posts thread and instructor replies successfully', async () => {
    // 1. Student creates a discussion post
    const postRes = await request(app)
      .post(`/api/courses/${jsCourse._id}/discussions`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'How does event loop microtask queuing behave with async functions?',
        content: 'When an async function awaits a resolved promise, is the continuation queued as a microtask?'
      });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.success).toBe(true);
    const discussionId = postRes.body.discussion._id;

    // 2. Instructor replies to the thread
    const replyRes = await request(app)
      .post(`/api/discussions/${discussionId}/replies`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        content: 'Yes! `await` pauses execution and registers the remaining function code as a microtask continuation callback.'
      });

    expect(replyRes.statusCode).toBe(201);
    expect(replyRes.body.success).toBe(true);
    expect(replyRes.body.reply.content).toMatch(/microtask continuation/i);

    // 3. Verify thread fetches with the reply
    const getRes = await request(app)
      .get(`/api/discussions/${discussionId}/replies`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.replies.length).toBeGreaterThanOrEqual(1);
  });

  // ========================================================
  // TC15: Registration and login work
  // ========================================================
  test('TC15: Registration and login work -> Expected: New account created and authenticated via JWT', async () => {
    const uniqueEmail = `eval_${Date.now()}@learnsphere.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Evaluation Candidate',
        email: uniqueEmail,
        password: 'Password123!',
        role: 'student'
      });

    expect(regRes.statusCode).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.token).toBeDefined();

    // Verify login with newly registered credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'Password123!'
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe(uniqueEmail);

    // Clean up created user
    await User.findByIdAndDelete(regRes.body.user.id);
  });
});
