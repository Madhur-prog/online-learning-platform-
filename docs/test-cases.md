# LearnSphere - Test Cases & Verification Matrix (TC01 - TC15)

This document provides the complete specification for the automated integration test suite of **LearnSphere**, covering all core functional requirements, positive workflows, negative validation & security boundaries, the BUG-001 regression test, and the Discussion Forum requirement change (TC14).

All 15 test cases are implemented in [learnsphere.test.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/tests/learnsphere.test.js) and pass with 100% success rate.

---

## 1. Master Test Execution Matrix

| Test ID | Module | Scenario | Input & Preconditions | Expected Result | Result |
|:---:|---|---|---|---|:---:|
| **TC01** | Video Lessons | Enrolled student opens video lesson | Enrolled student calls `GET /api/lessons/:id` | HTTP 200 OK, returns lesson title and valid playable video URL | **PASS** |
| **TC02** | Study Materials | Student retrieves material metadata | Authenticated student calls `GET /api/courses/:id/materials` | HTTP 200 OK, returns list of materials with title, size, and file type | **PASS** |
| **TC03** | Study Materials | Student downloads PDF file | Student calls `GET /api/materials/:id/download` | HTTP 200 OK, `Content-Disposition` header contains `attachment; filename=*.pdf` | **PASS** |
| **TC04** | Quiz Engine | Student retrieves quiz questions | Student calls `GET /api/quizzes/:id` before taking quiz | HTTP 200 OK, $\ge 5$ questions returned with 4 options each; **correct answers and explanations are hidden** | **PASS** |
| **TC05** | Quiz Engine | Student submits valid quiz answers | Student sends `POST /api/quizzes/:id/submit` with selected option indices | HTTP 200 OK, score calculated, attempt record created in MongoDB, percentage returned | **PASS** |
| **TC06** | Quiz Scoring | Backend calculates weighted score (BUG-001) | Sample quiz with weighted marks (Q1=1, Q2=2, Q3=2, Q4=2, Q5=3); Student scores 6/10 | Percentage = 60%, passed = true; validates proportional calculation rather than equal-weight counting | **PASS** |
| **TC07** | Quiz Engine | Student submits incomplete quiz | Student submits partial answers (2 out of 5 questions answered) | HTTP 200 OK, unanswered questions scored 0 marks, score evaluated against total possible marks | **PASS** |
| **TC08** | Assignments | Student uploads valid PDF assignment | Student uploads `.pdf` to `POST /api/assignments/:id/submit` | HTTP 200 OK, Multer stores file on disk, submission tagged as `Submitted` or `Late` | **PASS** |
| **TC09** | Assignments | Student attempts to upload unsupported file | Student uploads `.txt` file to `POST /api/assignments/:id/submit` | HTTP 400 Bad Request, file rejected by Multer extension filter with validation error message | **PASS** |
| **TC10** | Assignments | Student retrieves assignment status | Student calls `GET /api/assignments/:id/status` | HTTP 200 OK, returns assignment deadline, submission timestamp, and current status | **PASS** |
| **TC11** | Grading Console | Instructor grades assignment | Instructor sends `PUT /api/submissions/:id/grade` with marks (95) and feedback | HTTP 200 OK, submission status transitions to `Graded`, marks and feedback saved | **PASS** |
| **TC12** | Assignments | Student views graded assignment results | Student calls `GET /api/assignments/:id/status` after grading | HTTP 200 OK, displays status `Graded`, awarded score (95), and instructor remarks | **PASS** |
| **TC13** | Security / RBAC | Unauthorized access to protected content | Student 2 accesses Student 1's private quiz attempt; unauthenticated request to status | HTTP 403 Forbidden for cross-student access; HTTP 401 Unauthorized for missing token | **PASS** |
| **TC14** | Discussion Forum | Course discussion thread and instructor reply (CR-001) | Student posts question to `POST /api/courses/:id/discussions`; Instructor posts reply | HTTP 201 Created for question & reply; thread listing displays question with threaded reply | **PASS** |
| **TC15** | Authentication | Account registration and login workflow | Register unique student via `POST /api/auth/register`, then login via `POST /api/auth/login` | HTTP 201 Created on registration; HTTP 200 OK on login; password hashed with bcrypt; valid JWT issued | **PASS** |

---

## 2. Detailed Test Specifications

### TC01: Enrolled student opens video lesson
- **Preconditions:** Course and lesson exist in MongoDB; student is authenticated and enrolled.
- **Request:** `GET /api/lessons/:id` with `Authorization: Bearer <token>`.
- **Assertions:**
  - Status code is 200.
  - `response.body.success === true`.
  - `response.body.lesson.videoUrl` is a non-empty string.
  - `response.body.lesson.title` matches lesson name.

### TC02: Student retrieves study material metadata
- **Preconditions:** Course has seeded study materials in MongoDB.
- **Request:** `GET /api/courses/:id/materials` with `Authorization: Bearer <token>`.
- **Assertions:**
  - Status code is 200.
  - `response.body.materials` is an array of length $\ge 1$.
  - Each item contains `title`, `fileType`, `fileSize`, and `filePath`.

### TC03: Student downloads PDF
- **Preconditions:** `javascript_handbook.pdf` exists physically in `backend/uploads/materials/`.
- **Request:** `GET /api/materials/:id/download` with auth token.
- **Assertions:**
  - Status code is 200.
  - Header `content-disposition` contains `attachment; filename=...`.
  - Stream is served with `application/pdf`.

### TC04: Student retrieves quiz questions (answers hidden)
- **Preconditions:** Quiz exists in MongoDB; student has not yet submitted an attempt.
- **Request:** `GET /api/quizzes/:id` with `Authorization: Bearer <token>`.
- **Assertions:**
  - Status code is 200.
  - `response.body.quiz.questions` has 5 items.
  - Each question has 4 options.
  - **Security Check:** `question.correctOptionIndex === undefined` and `question.explanation === undefined`.

### TC05: Student submits valid quiz answers
- **Preconditions:** Valid quiz exists; student submits selected answers array.
- **Request:** `POST /api/quizzes/:id/submit` with `answers: [...]`.
- **Assertions:**
  - Status code is 200.
  - `response.body.attemptId` is returned.
  - `QuizAttempt` document saved in MongoDB.
  - `response.body.result.percentage` and `response.body.result.passed` are accurately calculated.

### TC06: Backend calculates correct score (BUG-001 weighted marks)
- **Preconditions:** Questions have different mark weights (e.g. Q1=1, Q2=2, Q3=2, Q4=2, Q5=3; total = 10).
- **Execution:** Pure function calculation via `calculateQuizScore`.
- **Assertions:**
  - Student earning Q1(1) + Q2(2) + Q5(3) = 6 marks receives exactly $6/10 = 60\%$.
  - Contrast with buggy unweighted scorer which would produce incorrect ratios.

### TC07: Student submits incomplete quiz according to policy
- **Preconditions:** Student only answers 2 out of 5 questions.
- **Request:** `POST /api/quizzes/:id/submit` with 2 answer objects.
- **Assertions:**
  - Status code is 200.
  - Score is computed against total possible marks (10 marks) rather than only answered marks.
  - Unanswered questions are scored as 0 marks.

### TC08: Student uploads valid PDF assignment
- **Preconditions:** Valid assignment exists in course.
- **Request:** `POST /api/assignments/:id/submit` with multipart form-data attaching a `.pdf` file.
- **Assertions:**
  - Status code is 200.
  - Multer stores file under `backend/uploads/assignments/`.
  - Status is set to `Submitted` (or `Late` if past due date).

### TC09: Student attempts to upload unsupported file
- **Preconditions:** Student attempts to upload `.txt` or `.exe`.
- **Request:** `POST /api/assignments/:id/submit` attaching `.txt` file.
- **Assertions:**
  - Status code is 400 Bad Request.
  - `response.body.success === false`.
  - Error message states only PDF and DOCX files are allowed.

### TC10: Student retrieves assignment status
- **Preconditions:** Student has previously submitted the assignment.
- **Request:** `GET /api/assignments/:id/status` with student token.
- **Assertions:**
  - Status code is 200.
  - Returns assignment title, deadline, max marks, and student's submission record.

### TC11: Instructor grades assignment
- **Preconditions:** Submission exists; instructor owns the course.
- **Request:** `PUT /api/submissions/:id/grade` with `{ marks: 95, feedback: "Outstanding..." }`.
- **Assertions:**
  - Status code is 200.
  - Submission `marks` updated to 95.
  - Submission `status` updated to `Graded`.
  - Instructor feedback stored.

### TC12: Student views graded assignment results
- **Preconditions:** Submission was graded by instructor.
- **Request:** `GET /api/assignments/:id/status` with student token.
- **Assertions:**
  - Status code is 200.
  - Student sees status `Graded`, marks `95`, and feedback remarks.

### TC13: Unauthorized student attempts to access protected content
- **Preconditions:** Student 2 attempts to view Student 1's private quiz attempt.
- **Request:** `GET /api/quizzes/attempts/:id` using Student 2 token.
- **Assertions:**
  - Status code is 403 Forbidden.
  - Message confirms access denied.
  - Unauthenticated request returns 401 Unauthorized.

### TC14: Discussion forum and replies work (CR-001)
- **Preconditions:** Student is enrolled in course; instructor is course author.
- **Request:**
  1. Student posts question to `POST /api/courses/:id/discussions`.
  2. Instructor posts reply to `POST /api/discussions/:id/replies`.
  3. Student reads thread via `GET /api/discussions/:id/replies`.
- **Assertions:**
  - Question creation returns 201 Created.
  - Reply creation returns 201 Created.
  - Thread retrieval returns 200 OK with the reply in chronological sequence.

### TC15: Registration and login work
- **Preconditions:** New unique email address.
- **Request:**
  1. `POST /api/auth/register` with role `student`.
  2. `POST /api/auth/login` with registered credentials.
- **Assertions:**
  - Registration returns 201 Created with JWT.
  - Login returns 200 OK with verified JWT and correct email in payload.
