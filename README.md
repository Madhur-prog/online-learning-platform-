# LearnSphere - Full-Stack Online Learning Platform

[![Tests](https://img.shields.io/badge/tests-14%20passed-brightgreen.svg)]()
[![Node](https://img.shields.io/badge/node-v24+-blue.svg)]()
[![React](https://img.shields.io/badge/react-v19-61dafb.svg)]()
[![MongoDB](https://img.shields.io/badge/mongodb-v8-47a248.svg)]()
[![Tailwind](https://img.shields.io/badge/tailwindcss-v4-38b2ac.svg)]()

> Developed for Academic External Jury Evaluation focusing on **Agile Software Development and Requirement Changes**.

---

## 1. Project Overview
**LearnSphere** is an enterprise-grade full-stack online learning management system (LMS) engineered with React.js, Node.js, Express.js, and MongoDB. The platform provides a rich educational environment featuring video lecture streaming, downloadable curricula, backend-scored quizzes, assignment submissions with instructor grading, and course-specific discussion forums.

---

## 2. Problem Statement
Traditional online learning prototypes often suffer from static hardcoded data, fragile frontend-only mock state, and a lack of real-time student-instructor feedback loops. Furthermore, educational platforms must dynamically adapt to changing stakeholder requirements (such as adding collaboration tools post-sprint) and maintain algorithmic precision in grading assessments with non-uniform weights.

---

## 3. Project Objectives
1. **Full-Stack Integrity:** Deliver a completely working production application where all user actions persist directly to MongoDB via REST APIs.
2. **Agile Requirement Change Demonstration:** Illustrate Agile adaptation by absorbing a newly requested **Course Discussion Forum** into Sprint 2 following stakeholder review.
3. **Software Quality & Testing Rigor:** Implement positive and negative test cases (TC01 - TC12) and demonstrate identification, documentation, correction, and automated regression testing of a critical scoring defect (**BUG-001**).
4. **Professional UI/UX:** Provide a polished, accessible, responsive interface modeled on modern LMS platforms like Coursera and Udemy.

---

## 4. Technology Stack

- **Frontend:**
  - React.js with Vite
  - JavaScript (ES6+)
  - Tailwind CSS (v4)
  - React Router (v7)
  - Axios HTTP Client
  - Lucide React Icons
- **Backend:**
  - Node.js & Express.js REST API
  - JWT (JSON Web Token) Authentication
  - bcrypt password hashing
  - Multer for assignment and material uploads
- **Database:**
  - MongoDB (Mongoose ODM v8)
- **Testing:**
  - Jest & Supertest
  - Automated Regression Suite

---

## 5. Folder Structure

```text
LearnSphere/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx                 (Page 1)
│   │   │   ├── LoginPage.jsx                   (Page 2)
│   │   │   ├── RegisterPage.jsx                (Page 3)
│   │   │   ├── StudentDashboard.jsx            (Page 4)
│   │   │   ├── CourseCatalog.jsx               (Page 5)
│   │   │   ├── CourseDetails.jsx               (Page 6)
│   │   │   ├── MyLearning.jsx                  (Page 7)
│   │   │   ├── VideoLessonPlayer.jsx           (Page 8)
│   │   │   ├── StudyMaterials.jsx              (Page 9)
│   │   │   ├── QuizAttempt.jsx                 (Page 10)
│   │   │   ├── QuizResults.jsx                 (Page 11)
│   │   │   ├── AssignmentSubmission.jsx        (Page 12)
│   │   │   ├── AssignmentStatus.jsx            (Page 13)
│   │   │   ├── CourseDiscussionForum.jsx       (Page 14)
│   │   │   ├── InstructorDashboard.jsx         (Page 15)
│   │   │   ├── CourseManagement.jsx            (Page 16)
│   │   │   ├── QuizAndAssignmentManagement.jsx (Page 17)
│   │   │   ├── StudentSubmissionReview.jsx     (Page 18)
│   │   │   └── ProfilePage.jsx                 (Page 19)
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── courseService.js
│   │   │   ├── quizService.js
│   │   │   ├── assignmentService.js
│   │   │   └── discussionService.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Lesson.js
│   │   ├── StudyMaterial.js
│   │   ├── Quiz.js
│   │   ├── QuizAttempt.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Discussion.js
│   │   └── Reply.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   ├── materialController.js
│   │   ├── quizController.js
│   │   ├── assignmentController.js
│   │   └── discussionController.js
│   ├── routes/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roles.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── services/
│   │   └── quizScorer.js
│   ├── uploads/
│   │   ├── materials/
│   │   └── assignments/
│   ├── tests/
│   │   ├── fixtures/
│   │   │   └── buggyQuizScorer.js
│   │   └── learnsphere.test.js
│   ├── seed/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── requirements.md
│   ├── sprint-plan.md
│   ├── requirement-change.md
│   ├── test-cases.md
│   ├── defect-report.md
│   ├── api-documentation.md
│   └── jury-demo-guide.md
│
├── README.md
└── package.json
```

---

## 6. Installation & Quick Start Instructions

### Prerequisites
- **Node.js**: v18+ (verified on v24.16.0)
- **npm**: v9+ (verified on 11.13.0)
- **MongoDB**: Community Server running on `127.0.0.1:27017`

### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in both folders (already pre-configured for local development):
```bash
# In backend/.env:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/learnsphere
JWT_SECRET=learnsphere_academic_jury_evaluation_secret_key_2026
JWT_EXPIRE=7d
NODE_ENV=development

# In frontend/.env:
VITE_API_BASE_URL=/api
```

### Step 3: Seed Sample Demonstration Data
Run the repeatable seed script to populate realistic courses, lectures, materials, quizzes, assignments, and forum discussions:
```bash
cd backend
npm run seed
```

---

## 7. Starting the Application

### Terminal 1: Start Backend API (Port 5000)
```bash
cd backend
npm start
# Server listens at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Terminal 2: Start Frontend Development Server (Port 5173)
```bash
cd frontend
npm run dev
# Vite runs at http://localhost:5173
```

---

## 8. Demo Login Credentials

| Role | Name | Email | Password | Quick-Fill Card |
|---|---|---|---|:---:|
| **Student** | Alex Chen | `student@learnsphere.com` | `Password123!` | Available on Login page |
| **Student 2** | Priya Patel | `priya@learnsphere.com` | `Password123!` | Manual entry |
| **Instructor** | Dr. Sarah Jenkins | `instructor@learnsphere.com` | `Password123!` | Available on Login page |

---

## 9. Features Implemented

1. **Role-Based Authentication:** JWT-secured registration and login with bcrypt hashing.
2. **Course Catalog & Filtering:** Multi-category filtering and keyword search with real MongoDB queries.
3. **Video Lesson Player:** Full playback controls, playlist sidebar, next/prev navigation, and progress syncing.
4. **Study Material Access:** Downloadable PDFs, DOCX, and PPTX with MIME validation.
5. **Interactive Quiz Engine:** Auto-scoring in backend, weighted question marks, pass/fail evaluation, and question reviews.
6. **Assignment Workflow:** PDF/DOCX dropzone, late submission detection, instructor grading modal with feedback.
7. **Discussion Forum (Post-Sprint 1 Requirement):** Course-specific threaded discussion forum with instructor verified badges.
8. **Instructor Hub:** Course authoring, syllabus builder, quiz creator, and submission evaluation console.

---

## 10. Automated Testing Instructions

Run the automated test suite covering positive, negative, and BUG-001 regression tests:

```bash
cd backend
npm test
```

### Test Suite Execution Output:
```text
PASS tests/learnsphere.test.js
  LearnSphere Full-Stack API Test Suite (TC01 - TC12 & BUG-001)
    Authentication Module
      √ TC01: Student logs in with valid credentials (Positive)
      √ TC07 [Negative]: Login with incorrect password
      √ Setup: Instructor login & second student login for testing isolation
    Course Catalog & Enrollment Module
      √ TC02: Student enrolls in a course (Positive)
      √ TC12 [Negative]: Student tries to create an instructor-only course
    Lesson Module
      √ TC03: Student opens a video lesson (Positive)
    Quiz Module & BUG-001 Defect Correction
      √ TC04: Student submits valid quiz answers (Positive)
      √ TC08 [Negative]: Submit quiz without required answers
      √ TC10 [Negative]: Access another student private quiz result
      √ BUG-001 Regression Test: Weighted Quiz Score vs Buggy Equal-Weight Score
    Assignment Module
      √ TC05: Student uploads a valid PDF assignment (Positive)
      √ TC09 [Negative]: Upload an unsupported assignment file
    Course Discussion Forum Module (Requirement Change)
      √ TC06: Student creates a discussion post (Positive)
      √ TC11 [Negative]: Submit an empty discussion message

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

---

## 11. Requirement Change & Defect Correction Summary

### Agile Requirement Change (Post-Sprint 1)
- **New Feature:** Course Discussion Forum (`docs/requirement-change.md`).
- **Reason:** Addressed asynchronous student isolation discovered during the Sprint 1 stakeholder review.
- **Impact:** Added `Discussion` and `Reply` MongoDB models, 5 new REST endpoints, `CourseDiscussionForum.jsx`, and automated tests TC06 & TC11.

### Software Defect Correction (BUG-001)
- **Module:** Quiz Score Calculation (`docs/defect-report.md`).
- **Defect:** Equal-weight calculation ($2/3 = 66.67\%$) rather than question-weighted marks calculation ($7/10 = 70\%$).
- **Resolution:** Corrected in `backend/services/quizScorer.js`; buggy version preserved in `backend/tests/fixtures/buggyQuizScorer.js` for educational demonstration.
- **Verification:** Passing automated regression test in `backend/tests/learnsphere.test.js`.

---

## 12. External Jury Step-by-Step Guide
For the full 15-step presentation script explaining which screens, endpoints, and database collections to present, consult [docs/jury-demo-guide.md](file:///c:/Users/bhara/Desktop/jury_project_agile/docs/jury-demo-guide.md).
