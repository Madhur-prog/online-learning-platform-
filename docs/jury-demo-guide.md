# LearnSphere - Academic External Jury Demonstration Guide

This step-by-step walkthrough is tailored for the external academic evaluation of **LearnSphere**, demonstrating Agile software engineering, dynamic requirement adaptation, and software testing rigor.

---

## Preparation: System Verification & Demo Credentials

Before beginning the jury presentation, ensure the backend and frontend servers are running:

```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (Port 5173)
cd frontend
npm run dev
```

### Ready Demo Accounts:
- **Student Account:** `student@learnsphere.com` / `Password123!` (Alex Chen)
- **Student Account 2:** `priya@learnsphere.com` / `Password123!` (Priya Patel)
- **Instructor Account:** `instructor@learnsphere.com` / `Password123!` (Dr. Sarah Jenkins)

*(Tip: Both demo accounts can also be filled with a single click on the login screen using the quick-fill buttons).*

---

## 15-Step External Evaluation Script

### Step 1: Open LearnSphere
- **UI Screen:** `http://localhost:5173/` (Landing Page).
- **Explanation:** Point out the production-grade visual design: hero section, value propositions, category pills, and featured courses loaded dynamically from MongoDB.
- **Behind the Scenes:** Requests `GET /api/courses` from backend; zero hardcoded frontend mocks.

### Step 2: Log in as a Student
- **UI Screen:** Navigate to `http://localhost:5173/login`.
- **Action:** Click the "Student Account (Alex Chen)" demo card or enter `student@learnsphere.com` and `Password123!`. Click **Sign In**.
- **Explanation:** The system verifies the bcrypt password hash in MongoDB collection `users` and issues a secure JWT token stored in `localStorage`.
- **API Endpoint:** `POST /api/auth/login`.

### Step 3: Browse Available Courses
- **UI Screen:** Navigate to `http://localhost:5173/courses` (Course Catalog).
- **Action:** Type "Python" in the search bar or click the "Database Management" category filter.
- **Explanation:** Demonstrates real-time filtering and search queries hitting the MongoDB database via Mongoose regex queries.
- **API Endpoint:** `GET /api/courses?category=...&search=...`.

### Step 4: Enroll in a Course
- **UI Screen:** Click on **JavaScript Fundamentals** (`/courses/<id>`).
- **Action:** Note the "Enroll in Course (Free)" button (or if already enrolled from seed, enroll in Python Programming). Click **Enroll**.
- **Explanation:** Shows immediate atomic persistence in the `enrollments` collection in MongoDB, transitioning the UI state to "Enrolled - Continue Learning".
- **API Endpoint:** `POST /api/courses/:id/enroll`.
- **DB Collection:** `db.enrollments.find({ studentId: ... })`.

### Step 5: Open a Video Lesson
- **UI Screen:** Click **Go to Lessons** or select Lesson 1 from the syllabus table (`/courses/<courseId>/lessons/<lessonId>`).
- **Action:** Play the educational video. Scrub through the timeline and adjust volume. Click **Mark as Completed**.
- **Explanation:** Demonstrates the HTML5 responsive video player, syllabus sidebar with checkmarks, and progress synchronization (`POST /api/courses/:id/progress`), recalculating course completion percentage.
- **API Endpoint:** `GET /api/lessons/:id` and `POST /api/courses/:id/progress`.

### Step 6: Access Study Material
- **UI Screen:** Click the "Study Materials" tab or navigate to `/materials`.
- **Action:** Click the **Download** button next to *JavaScript Core Handbook & Scoping Notes* (`.pdf`).
- **Explanation:** Show that the browser initiates a real file download streamed from `backend/uploads/materials/` with proper MIME headers.
- **API Endpoint:** `GET /api/materials/:id/download`.
- **DB Collection:** `db.studymaterials.find()`.

### Step 7: Attempt a Quiz
- **UI Screen:** Under course tabs or via sidebar, click **Quizzes** -> Click **Start Quiz** on *JavaScript Fundamentals & Lexical Scopes Quiz*.
- **Action:** Point out question weight marks (Question 1 = 2 marks, Question 2 = 3 marks, Question 3 = 5 marks). Select answers.
- **Explanation:** Crucial security point: Explain that the correct answer indices are **completely hidden from the student** in the API response until after submission, preventing frontend inspection cheats.
- **API Endpoint:** `GET /api/quizzes/:id`.

### Step 8: Submit the Quiz and View Calculated Score
- **UI Screen:** Click **Submit Quiz Now** -> automatically transitions to `/quizzes/results/<attemptId>`.
- **Action:** Inspect the scorecard: Total Questions, Earned Score, Percentage, Pass/Fail status badge, and the question-by-question breakdown with explanations.
- **Explanation:** Scoring was computed entirely in the backend using the weighted calculation service (BUG-001 fix).
- **API Endpoint:** `POST /api/quizzes/:id/submit`.
- **DB Collection:** `db.quizattempts.find()`.

### Step 9: Upload an Assignment
- **UI Screen:** Return to Course Details -> **Assignments** -> Click **View & Submit** on *Build an Interactive DOM Todo Application*.
- **Action:** Attach a valid `.pdf` or `.docx` file into the upload dropzone. Click **Submit Assignment**.
- **Explanation:** Demonstrates Multer disk storage, extension filtering, file size validation, and on-time vs late status determination.
- **API Endpoint:** `POST /api/assignments/:id/submit`.
- **DB Collection:** `db.submissions.find()`.

### Step 10: View Assignment Submission Status
- **UI Screen:** `/assignments/<id>/status`.
- **Action:** Point out the submission date, file download link, and current status (`Submitted` or `Graded`).
- **Explanation:** Shows student visibility into their submission timeline and feedback.

### Step 11: Open the Course Discussion Forum (Sprint 2 Requirement Change)
- **UI Screen:** Open Course Details -> Click the **Discussion Forum** tab (`/courses/<id>/discussions`).
- **Action:** Review existing threads (*"Understanding the Event Loop"*). Notice that instructor replies carry a prominent verified **Instructor** badge.
- **Explanation:** Highlight that this feature was introduced after Sprint 1 based on user needs.

### Step 12: Create a Question & Reply as an Instructor
- **Action A (Student):** Click **Ask a Question**. Enter title: *"Why does `typeof null` return `'object'`?"* and details. Click **Post Question**. Thread immediately appears!
- **Action B (Instructor):** Log out and log in as `instructor@learnsphere.com`. Open the same course forum thread. Click **Reply** and post: *"This is a historical quirk from the first JavaScript prototype where object tags were coded as 0."*
- **Explanation:** Shows two-way interactive communication persisted in MongoDB `discussions` and `replies` collections.

### Step 13: Explain the Requirement Added After Sprint 1 Using Documentation
- **Screen:** Open `docs/requirement-change.md` and `docs/sprint-plan.md`.
- **Walkthrough:**
  1. Show the original backlog (Sprint 1) which only had courses, video, materials, quizzes, and assignments.
  2. Explain the reason for change: Asynchronous isolation identified during Sprint 1 review.
  3. Show the technical impact: New Mongoose models (`Discussion`, `Reply`), new REST APIs, access control guards (`checkCourseAccess`), and test cases (TC06, TC11).
  4. Show how the team reprioritized Sprint 2 to accommodate the forum without slipping dates.

### Step 14: Demonstrate Positive and Negative Test Cases
- **Action:** Open terminal and run the automated test suite:
  ```bash
  cd backend
  npm test
  ```
- **Walkthrough:** Show the 14 passing automated tests:
  - **TC01 - TC06 (Positive):** Login, Enrollment, Lessons, Quizzes, Assignments, Discussions.
  - **TC07 - TC12 (Negative):** Wrong password rejection (401), missing quiz answers (400), unsupported assignment file (400), accessing other student's quiz results (403), empty discussion message (400), student creating course (403).

### Step 15: Explain the Quiz Scoring Defect, Correction, and Regression Test
- **Screen:** Open `docs/defect-report.md`.
- **Walkthrough:**
  1. Explain **BUG-001**: Equal-weight assumption vs question-weighted scoring.
  2. Walk through the math: 3 questions with 2, 3, and 5 marks (Total = 10). If Q1 and Q3 are correct, student earns $7/10 = 70\%$. The buggy equal-weight calculation gave $2/3 = 66.67\%$.
  3. Show the educational fixture: `backend/tests/fixtures/buggyQuizScorer.js`.
  4. Show the active production fix: `backend/services/quizScorer.js`.
  5. Point out the passing regression test in the test suite output from Step 14!
