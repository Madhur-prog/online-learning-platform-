# LearnSphere - Test Cases & Verification Matrix

This document provides the full test matrix for automated and manual verification of LearnSphere, covering positive scenarios (TC01 - TC06), negative boundary and security scenarios (TC07 - TC12), and the BUG-001 regression test.

---

## 1. Test Summary Table

| Test ID | Type | Module | Scenario | Expected Result | Status |
|---|:---:|---|---|---|:---:|
| **TC01** | Positive | Authentication | Student logs in with valid credentials | 200 OK, JWT token issued, user object returned | **PASS** |
| **TC02** | Positive | Enrollment | Student enrolls in an active course | 201 Created, enrollment saved in MongoDB | **PASS** |
| **TC03** | Positive | Video Lessons | Student opens a sequential video lecture | 200 OK, video stream URL and metadata loaded | **PASS** |
| **TC04** | Positive | Quiz Engine | Student submits valid quiz answers | 200 OK, score calculated in backend, attempt stored | **PASS** |
| **TC05** | Positive | Assignments | Student uploads a valid PDF assignment | 200 OK, Multer stores file, status marked | **PASS** |
| **TC06** | Positive | Discussion Forum | Student creates a new discussion question | 201 Created, thread appears in course forum | **PASS** |
| **TC07** | Negative | Authentication | Login with incorrect password | 401 Unauthorized, rejected with error message | **PASS** |
| **TC08** | Negative | Quiz Engine | Submit quiz with empty/missing answers | 400 Bad Request, validation error | **PASS** |
| **TC09** | Negative | Assignments | Upload unsupported file type (.txt/.exe) | 400 Bad Request, file rejected by Multer filter | **PASS** |
| **TC10** | Negative | Security / RBAC | Student accesses another student's quiz attempt | 403 Forbidden, access denied | **PASS** |
| **TC11** | Negative | Discussion Forum | Submit an empty discussion title/content | 400 Bad Request, empty message rejected | **PASS** |
| **TC12** | Negative | Security / RBAC | Student attempts to create a new course | 403 Forbidden, restricted to instructor role | **PASS** |
| **BUG-001** | Regression | Quiz Scoring | Weighted questions vs equal-weight scoring | 70% earned vs 66.67% buggy calculation | **PASS** |

---

## 2. Detailed Test Specifications

### TC01: Student logs in with valid credentials
- **Category:** Positive
- **Preconditions:** User `student@learnsphere.com` exists in MongoDB.
- **Steps:**
  1. Send `POST /api/auth/login` with `{ "email": "student@learnsphere.com", "password": "Password123!" }`.
  2. Inspect HTTP status code and response payload.
- **Expected Result:** HTTP 200 OK, `success: true`, valid JWT token returned, `user.role === 'student'`.
- **Actual Result:** HTTP 200 OK, token issued. Test passed.

### TC02: Student enrolls in a course
- **Category:** Positive
- **Preconditions:** Student authenticated with JWT; course ID exists.
- **Steps:**
  1. Send `POST /api/courses/:id/enroll` with `Authorization: Bearer <token>`.
- **Expected Result:** HTTP 201 Created, enrollment record created with `progress: 0`.
- **Actual Result:** HTTP 201 Created, saved in MongoDB collection `enrollments`.

### TC03: Student opens a video lesson
- **Category:** Positive
- **Preconditions:** Lesson exists in MongoDB.
- **Steps:**
  1. Send `GET /api/lessons/:id` with `Authorization: Bearer <token>`.
- **Expected Result:** HTTP 200 OK, returns lesson `title`, `videoUrl`, `duration`, `order`.
- **Actual Result:** HTTP 200 OK, payload contains active MP4 URL.

### TC04: Student submits valid quiz answers
- **Category:** Positive
- **Preconditions:** Quiz exists; student provides array of selected options.
- **Steps:**
  1. Send `POST /api/quizzes/:id/submit` with valid answers array.
- **Expected Result:** HTTP 200 OK, backend calculates percentage and pass/fail; saves `QuizAttempt`.
- **Actual Result:** HTTP 200 OK, percentage matches earned marks ratio.

### TC05: Student uploads a valid PDF assignment
- **Category:** Positive
- **Preconditions:** Assignment exists; student uploads a `.pdf` file within 15MB.
- **Steps:**
  1. Send `POST /api/assignments/:id/submit` as multipart/form-data with `file`.
- **Expected Result:** HTTP 200 OK, Multer stores file on disk, `Submission` recorded in MongoDB.
- **Actual Result:** HTTP 200 OK, file stored in `backend/uploads/assignments/`.

### TC06: Student creates a discussion post
- **Category:** Positive
- **Preconditions:** Student is enrolled in the course.
- **Steps:**
  1. Send `POST /api/courses/:id/discussions` with non-empty `title` and `content`.
- **Expected Result:** HTTP 201 Created, thread created and author populated.
- **Actual Result:** HTTP 201 Created, visible in forum thread list.

### TC07 [Negative]: Login with incorrect password
- **Category:** Negative / Security
- **Steps:**
  1. Send `POST /api/auth/login` with `password: "WrongPassword999!"`.
- **Expected Result:** HTTP 401 Unauthorized, message: "Invalid email or password".
- **Actual Result:** HTTP 401 Unauthorized. No token issued.

### TC08 [Negative]: Submit quiz without required answers
- **Category:** Negative / Validation
- **Steps:**
  1. Send `POST /api/quizzes/:id/submit` with `answers: []`.
- **Expected Result:** HTTP 400 Bad Request, message: "Quiz answers are required and must not be empty".
- **Actual Result:** HTTP 400 Bad Request returned.

### TC09 [Negative]: Upload an unsupported assignment file
- **Category:** Negative / Validation
- **Steps:**
  1. Send `POST /api/assignments/:id/submit` attaching a `.txt` or `.exe` file.
- **Expected Result:** HTTP 400 Bad Request, message: "Invalid file type. Only PDF and DOCX files are allowed...".
- **Actual Result:** HTTP 400 Bad Request. Multer filter rejects file.

### TC10 [Negative]: Access another student's private quiz result
- **Category:** Negative / Security
- **Steps:**
  1. Student 2 attempts to fetch `GET /api/quizzes/attempts/:id` where attempt belongs to Student 1.
- **Expected Result:** HTTP 403 Forbidden, message: "Access denied. You cannot view other students' private quiz results."
- **Actual Result:** HTTP 403 Forbidden returned.

### TC11 [Negative]: Submit an empty discussion message
- **Category:** Negative / Validation
- **Steps:**
  1. Send `POST /api/courses/:id/discussions` with whitespace-only title or content.
- **Expected Result:** HTTP 400 Bad Request, message: "Discussion title and content are required and cannot be empty".
- **Actual Result:** HTTP 400 Bad Request returned.

### TC12 [Negative]: Student tries to create an instructor-only course
- **Category:** Negative / Security
- **Steps:**
  1. Student sends `POST /api/courses` with course data.
- **Expected Result:** HTTP 403 Forbidden, message: "User role 'student' is not authorized to access this resource".
- **Actual Result:** HTTP 403 Forbidden returned.

---

## 3. How to Execute the Automated Test Suite

Run the following command from the `backend/` directory:

```bash
npm test
```

Or from the workspace root:

```bash
npm run test:backend
```
