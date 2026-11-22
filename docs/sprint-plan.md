# LearnSphere - Agile Sprint Plan & Product Backlog

## 1. Agile Framework & Execution Model
The LearnSphere online learning platform was engineered following Scrum Agile principles across three focused sprints. A pivotal aspect of this project is demonstrating **Agile responsiveness to requirement changes** following Sprint 1 external stakeholder feedback.

---

## 2. Sprint Breakdown

### Sprint 1: Core Learning Features
- **Goal:** Establish core authentication, database foundation, course discovery, video lecture playback, and study material downloads.
- **Sprint Duration:** 2 Weeks
- **Key Deliverables:**
  - JWT Authentication and RBAC (Student & Instructor)
  - MongoDB models for User, Course, Lesson, Enrollment, StudyMaterial
  - Video lecture player with syllabus progression
  - Downloadable course materials (PDF, DOCX, PPTX)
- **Sprint 1 Review Outcome:** Stakeholders noted that while asynchronous content was robust, students lacked a direct communication channel to ask questions and discuss concepts with instructors and peers.

### Sprint 2: Assessments & The New Discussion Forum Requirement
- **Goal:** Implement the assessment engine (quizzes & assignments) and dynamically absorb the newly introduced **Course Discussion Forum** into the sprint backlog.
- **Sprint Duration:** 2 Weeks
- **Key Deliverables:**
  - Quiz taking interface and backend scoring calculation
  - Assignment upload mechanism with Multer (PDF, DOCX) and deadline tracking
  - **New Requirement:** Course-specific discussion forum with threaded questions and replies
  - Backlog reprioritization to accommodate forum database models and APIs without slipping the delivery date
- **Sprint 2 Review Outcome:** Assessment engine and discussion forum successfully validated in staging.

### Sprint 3: Quality Engineering, Bug Correction & Final Integration
- **Goal:** Build instructor grading workflows, resolve defects (BUG-001 weighted scoring calculation), perform positive and negative test automation (TC01 - TC12), and complete end-to-end polish.
- **Sprint Duration:** 2 Weeks
- **Key Deliverables:**
  - Instructor submission grading console with numerical marks and qualitative feedback
  - Identification, reproduction, and correction of BUG-001 (Quiz Score Calculation)
  - Regression testing suite and positive/negative test automation
  - Responsive UI/UX polish across all 19 application pages

---

## 3. Product Backlog Table

| Story ID | User Story | Priority | Sprint | Acceptance Criteria | Implementation Status |
|---|---|:---:|:---:|---|:---:|
| **US-01** | As a user, I want to register and log in as a student or instructor. | High | Sprint 1 | Passwords hashed with bcrypt; JWT token generated; role stored in DB. | **Completed** |
| **US-02** | As a student, I want to browse available courses and filter by category. | High | Sprint 1 | Catalog displays courses with category filters, search input, and lesson counts. | **Completed** |
| **US-03** | As a student, I want to enroll in a course so I can access its content. | High | Sprint 1 | Unique enrollment record stored in MongoDB; progress initialized to 0%. | **Completed** |
| **US-04** | As a student, I want to watch video lessons and track completion. | High | Sprint 1 | Video player streams lecture; clicking complete updates progress in MongoDB. | **Completed** |
| **US-05** | As a student, I want to download course study materials. | Medium | Sprint 1 | PDF, DOCX, PPTX files downloadable via authenticated backend endpoint. | **Completed** |
| **US-06** | As an instructor, I want to create courses and upload lessons. | High | Sprint 1 | Course creation and lesson authoring restricted to instructor role. | **Completed** |
| **US-07** | As a student, I want to attempt quizzes and view my score. | High | Sprint 2 | Backend calculates score; correct answers hidden before submission; score stored. | **Completed** |
| **US-08** | As a student, I want to upload PDF/DOCX assignments before the deadline. | High | Sprint 2 | Multer stores file; system tags on-time vs late submissions in MongoDB. | **Completed** |
| **US-09** *(NEW)* | **As an enrolled student or instructor, I want a course discussion forum to ask questions and post replies.** | **High (Added)** | **Sprint 2** | **Course-specific forum; empty messages rejected; instructor badge rendered; thread replies in chronological order.** | **Completed** |
| **US-10** | As an instructor, I want to review and grade student assignment submissions. | High | Sprint 3 | Instructor enters marks (0 to max) and qualitative feedback; status updates to 'Graded'. | **Completed** |
| **US-11** | As an instructor, I want to author quizzes with custom weighted marks per question. | Medium | Sprint 3 | Instructor can assign individual marks to questions; backend scorer sums weights. | **Completed** |
| **US-12** | As an engineer, I want automated regression tests for quiz scoring and role guards. | High | Sprint 3 | Jest + Supertest suite passes all positive, negative, and BUG-001 regression tests. | **Completed** |

---

## 4. Backlog Reprioritization Analysis
Following the Sprint 1 review on Day 14, the **Course Discussion Forum** was introduced as a critical user requirement. Under Agile methodology:
1. The Product Owner created User Story **US-09** and assigned it a **High** priority.
2. The team estimated **US-09** at 5 Story Points.
3. Lower-priority "advanced profile customization" stories were deferred to accommodate US-09 in Sprint 2 without extending the release timeline.
4. The database schema was extended with `Discussion` and `Reply` models, and dedicated REST routes were implemented and verified with automated test cases (TC06, TC11).
