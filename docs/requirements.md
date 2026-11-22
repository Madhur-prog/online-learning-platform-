# LearnSphere - System Requirements Specification

## 1. Project Overview
**LearnSphere** is an enterprise-grade, full-stack online learning platform developed for academic external jury evaluation focusing on **Agile Software Development and Requirement Changes**.

The platform delivers a modern educational experience comparable to Coursera or Udemy, connecting students and instructors through structured curricula, interactive multimedia lectures, automated assessment engines, document submissions, and peer-to-instructor discussion forums.

---

## 2. User Roles and Permissions (RBAC Matrix)

| Feature / Resource | Guest / Public | Student | Instructor |
|---|:---:|:---:|:---:|
| Browse Landing Page & Catalog | Yes | Yes | Yes |
| View Course Details & Overview | Yes | Yes | Yes |
| Register / Login | Yes | Yes | Yes |
| Course Enrollment | No | Yes | N/A (Owns/Teaches) |
| Video Lecture Streaming | No | Yes (Enrolled) | Yes (Author) |
| Download Study Materials (PDF, DOCX, PPTX) | No | Yes (Enrolled) | Yes |
| Attempt Interactive Quizzes | No | Yes (Enrolled) | N/A |
| Upload Assignment Solutions (PDF, DOCX) | No | Yes (Enrolled) | N/A |
| View Graded Submissions & Feedback | No | Yes (Self Only) | Yes (All Students) |
| Post Course Discussion Questions | No | Yes (Enrolled) | Yes |
| Reply to Course Discussion Threads | No | Yes (Enrolled) | Yes |
| Create / Edit Courses | No | No | Yes |
| Add Lessons & Educational Videos | No | No | Yes |
| Upload Reference Materials | No | No | Yes |
| Author Quizzes with Weighted Marks | No | No | Yes |
| Author Coursework Assignments | No | No | Yes |
| Grade Submissions & Award Marks | No | No | Yes |

---

## 3. Functional Requirements

### FR-01: Authentication & Authorization
- Secure account registration with email validation and role assignment (`student` or `instructor`).
- Industry-standard bcrypt salt and password hashing (cost factor 10).
- Stateless JWT (JSON Web Token) issuance with 7-day expiration.
- Role-based route guards on backend REST endpoints and frontend React Router routes.

### FR-02: Course Catalog & Discovery
- Real-time catalog filtering by category (Web Development, Programming, Database Management, Data Science).
- Keyword-based search against course titles and descriptions.
- Dynamic metadata calculation (enrolled student counts, total lesson count, difficulty level).

### FR-03: Video Lecture Streaming & Syllabus Progression
- Sequential lesson ordering (`order: 1, 2, 3...`) with duration metrics.
- HTML5 responsive video player supporting play, pause, seek, volume, and fullscreen.
- Lesson completion tracking updating student progress percentage (`0%` to `100%`).
- Next/Previous lesson syllabus navigation.

### FR-04: Study Material Access
- Supported file types: PDF, DOCX, PPTX.
- Secure file storage under `backend/uploads/materials/`.
- Download endpoint with MIME-type headers and original file name retention.

### FR-05: Automated Quiz Engine & Scoring
- Multi-question assessment with 4 multiple-choice options.
- Dynamic question weighting (questions support different mark allocations: e.g. 2 marks, 3 marks, 5 marks).
- Backend scoring calculation: Correct Answers Earned Marks / Total Possible Marks * 100.
- Automatic pass/fail evaluation against configurable threshold (default 60%).
- Private results viewing protecting students from unauthorized access (TC10).

### FR-06: Coursework Assignment Submissions
- Instructor defines assignment prompt, instructions, deadline, and maximum marks.
- Student file upload dropzone accepting PDF and DOCX documents (15MB maximum limit).
- Deadline verification: submissions received after the due date are automatically flagged as `Late`.
- Instructor grading console: numerical marks input and qualitative feedback.

### FR-07: Course Discussion Forum (Sprint 2 Requirement Change)
- Real-time discussion forum embedded directly within course pages.
- Access restricted strictly to enrolled students and course instructors.
- Question creation with title and details validation (empty messages rejected).
- Threaded chronological replies with author role badges (`Instructor` vs `Student`).

---

## 4. Non-Functional Requirements
- **Security**: Zero cleartext password storage; parameterized Mongoose queries preventing NoSQL injection; sanitized file upload filters.
- **Reliability**: Atomic database operations with MongoDB; persistent records; no volatile in-memory mock data.
- **Performance**: Sub-50ms API response times for indexed queries; client-side bundle under 500kB gzip.
- **Maintainability**: Clear separation of concerns into MVC layers (Models, Controllers, Routes, Middleware, Services).
- **Usability**: Professional responsive UI adhering to modern design standards (Plus Jakarta Sans typography, slate/blue color palette, accessible contrast ratios).
