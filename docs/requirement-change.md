# LearnSphere - Agile Requirement Change Document

## 1. Executive Summary
In accordance with Agile Software Development practices, software requirements evolve based on continuous stakeholder feedback and user testing. This document formally outlines the requirement change introduced after the Sprint 1 review, detailing its rationale, technical impact analysis, backlog reprioritization, and full implementation evidence.

---

## 2. Requirement Change Specification

### Original Requirement (Baseline - Sprint 1)
Students can browse courses, enroll, stream sequential video lectures, download instructor study materials, take quizzes, and submit written assignments.

### New Requirement (Introduced Post-Sprint 1 Review)
**Students and instructors require an integrated, course-specific Discussion Forum to ask questions, clarify complex concepts, and communicate asynchronously.**

---

## 3. Reason for Change
During the Sprint 1 Review demonstration, academic stakeholders and student user personas provided key feedback:
1. **Asynchronous Isolation:** Watching pre-recorded video lectures without an interactive channel leaves students stuck when encountering difficult conceptual barriers.
2. **Pedagogical Engagement:** Students needed a venue to ask specific code and conceptual questions directly tied to the course context.
3. **Instructor Scalability:** Instructors required a central place to answer common student inquiries publicly rather than answering repetitive one-on-one emails.

---

## 4. Technical Impact Analysis

The introduction of the Discussion Forum impacted all layers of the LearnSphere full-stack architecture:

### 4.1 Database Architecture (MongoDB / Mongoose ODM)
Two new relational models were engineered:
- **`Discussion` Model (`backend/models/Discussion.js`):**
  - `courseId`: ObjectId reference to Course
  - `authorId`: ObjectId reference to User
  - `title`: String, required, trimmed
  - `content`: String, required, trimmed
  - `createdAt`, `updatedAt`: Timestamps
- **`Reply` Model (`backend/models/Reply.js`):**
  - `discussionId`: ObjectId reference to Discussion
  - `authorId`: ObjectId reference to User
  - `content`: String, required, trimmed
  - `createdAt`: Timestamp

### 4.2 Backend REST API Endpoints
Dedicated endpoints were designed and implemented:
- `GET /api/courses/:id/discussions`: Returns all threads for a course, populated with author details and reply counts.
- `POST /api/courses/:id/discussions`: Creates a new thread. Validates non-empty title and content.
- `GET /api/discussions/:id/replies`: Fetches chronological replies for a given thread.
- `POST /api/discussions/:id/replies`: Appends a reply to a thread. Validates non-empty content.
- `DELETE /api/discussions/:id`: Allows the author or course instructor to moderate threads.

### 4.3 Security & Role-Based Authorization
- Access control middleware (`checkCourseAccess`) was added to ensure that only students enrolled in the specific course or the course instructor can read or post to that course's discussion forum. Unauthorized requests return `403 Forbidden`.

### 4.4 Frontend UI/UX Components
- Created `CourseDiscussionForum.jsx` (`frontend/src/pages/CourseDiscussionForum.jsx`).
- Fully embedded into `CourseDetails.jsx` as a first-class tab.
- Distinct instructor badge styling (`ShieldCheck` badge with blue pill) to emphasize authoritative faculty responses.
- Client-side validation ensuring empty messages cannot be submitted.

### 4.5 Quality Assurance & Automated Testing
Two new automated test cases were integrated into the CI test suite:
- **TC06 (Positive):** Student creates a discussion post -> Post is saved to MongoDB and returned with author information.
- **TC11 (Negative):** Attempting to submit an empty discussion message -> Rejected with `400 Bad Request` and validation error message.

---

## 5. Priority Change & Sprint Backlog Reprioritization

| Aspect | Before Sprint 1 Review | After Sprint 1 Review |
|---|---|---|
| **Backlog Priorities** | 1. Video Player<br>2. Study Materials<br>3. Quizzes<br>4. Assignments<br>5. Profile Customizations | 1. Quizzes & Assessments<br>2. Assignments<br>**3. Course Discussion Forum (High)**<br>4. Grading Console<br>5. Profile Customizations (Deferred) |
| **Sprint 2 Scope** | Quizzes & Assignments | Quizzes, Assignments, **AND Course Discussion Forum** |
| **Effort Reallocation** | Advanced profile settings (5 SP) | Profile settings deferred to post-MVP; 5 SP allocated to Discussion Forum |
| **Delivery Date Impact** | None | Maintained through disciplined Agile scope trade-off |

---

## 6. Implementation Evidence

- **Database Models:** [Discussion.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/models/Discussion.js), [Reply.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/models/Reply.js)
- **Controller Logic:** [discussionController.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/controllers/discussionController.js)
- **Route Definitions:** [discussionRoutes.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/routes/discussionRoutes.js), [courseRoutes.js](file:///c:/Users/bhara/Desktop/jury_project_agile/backend/routes/courseRoutes.js)
- **Frontend Component:** [CourseDiscussionForum.jsx](file:///c:/Users/bhara/Desktop/jury_project_agile/frontend/src/pages/CourseDiscussionForum.jsx)
- **Automated Verification:** Verified in `backend/tests/learnsphere.test.js` (TC06 and TC11 passing).
