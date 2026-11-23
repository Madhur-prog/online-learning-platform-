# LearnSphere - Agile Sprint Plan & Product Backlog

> **Notice on Version Control (Git History Disclosure):**  
> In the project's Git repository (`git log`), commits reflect the integrated release (`344540d` and `877aefb`). This sprint plan models the **simulated Agile development lifecycle** across 3 two-week sprints, highlighting stakeholder feedback absorption, change control (CR-001), velocity estimation, and backlog reprioritization for external jury assessment.

---

## 1. Agile Framework & Execution Model
LearnSphere followed Scrum Agile practices with 2-week sprint cadences, cross-functional engineering, velocity tracking (Story Points based on modified Fibonacci), and formal sprint reviews.

**Core Team Metrics:**
- **Sprint Duration:** 2 Weeks (10 working days)
- **Target Velocity Capacity:** 28–30 Story Points (SP) per sprint
- **Total Sprints:** 3 Sprints (6 Weeks Total)

---

## 2. Sprint-by-Sprint Execution Breakdown

### Sprint 1: Core Learning Foundation (No Discussion Forum)
- **Goal:** Build the essential core platform: authentication, database models, course catalog, sequential HTML5 video lecture player, and downloadable reference materials.
- **Sprint Duration:** 2 Weeks | **Capacity:** 30 SP | **Delivered Velocity:** 29 SP
- **Committed Backlog:**
  - US-01: User Authentication & RBAC (5 SP)
  - US-02: Course Discovery & Catalog Filtering (5 SP)
  - US-03: Student Course Enrollment (3 SP)
  - US-04: Video Lecture Player & Progress Tracking (8 SP)
  - US-05: Downloadable Study Materials (PDF, DOCX) (3 SP)
  - US-06: Instructor Course & Lesson Management (5 SP)
- **Sprint 1 Review Outcome (The Change Trigger):**
  - Evaluators and student testers validated the video and material delivery but highlighted severe **asynchronous student isolation**.
  - **Stakeholder Decision:** A course-bound Discussion Forum is required to enable students to ask questions and instructors to broadcast answers.

---

### Sprint 2: Assessments & The Reprioritized Discussion Forum (CR-001)
- **Goal:** Deliver the assessment engine (quizzes and assignments) while dynamically absorbing **Change Request CR-001 (Course Discussion Forum)** into the sprint backlog.
- **Sprint Duration:** 2 Weeks | **Capacity:** 18 SP | **Delivered Velocity:** 18 SP
- **Agile Scope Trade-off:**
  - Deferred original US-09 (User Profile Customization - 5 SP) to post-MVP icebox.
  - Spliced in new US-09 (Course Discussion Forum - 5 SP) at **High Priority**.
- **Committed Backlog:**
  - US-07: Interactive Quiz Engine & Scoring (8 SP)
  - US-08: Assignment Upload with Multer & Deadline Tracking (5 SP)
  - **US-09 (NEW - CR-001): Course-Specific Discussion Forum & Threaded Replies (5 SP)**
- **Sprint 2 Review Outcome:**
  - Quizzes, assignments, and the collaborative forum demonstrated successfully in staging.

---

### Sprint 3: Quality Engineering, Defect Correction & Evaluation Polish
- **Goal:** Implement instructor grading console, identify and correct quiz scoring defect BUG-001, implement automated test suite (TC01 to TC15), and complete final UX polish.
- **Sprint Duration:** 2 Weeks | **Capacity:** 20 SP | **Delivered Velocity:** 20 SP
- **Committed Backlog:**
  - US-10: Instructor Submission Grading Console & Feedback (5 SP)
  - US-11: Weighted Question Marks Authoring & BUG-001 Defect Correction (5 SP)
  - US-12: Full-Stack Automated Test Suite covering TC01 to TC15 (5 SP)
  - US-13: Student Dashboard Analytics & Activity Feed (5 SP)
- **Sprint 3 Review Outcome:**
  - 15 out of 15 automated tests passing; end-to-end user workflows verified; project ready for external academic jury evaluation.

---

## 3. Product Backlog Table (Post-Sprint 1 Reprioritization)

| Story ID | User Story Title | Story Points | Priority | Sprint | Agile Status | Acceptance Criteria Summary |
|---|---|:---:|:---:|:---:|:---:|---|
| **US-01** | User Authentication | 5 | High | Sprint 1 | **Done** | Bcrypt password hash, JWT issuance, student/instructor role guard. |
| **US-02** | Course Catalog & Search | 5 | High | Sprint 1 | **Done** | Keyword search, category filters, live count metrics from MongoDB. |
| **US-03** | Course Enrollment | 3 | High | Sprint 1 | **Done** | Atomic record in `enrollments` collection; progress starts at 0%. |
| **US-04** | Video Lecture Player | 8 | High | Sprint 1 | **Done** | Local MP4 & YouTube embed player; completion status updates DB. |
| **US-05** | Study Materials Access | 3 | Medium | Sprint 1 | **Done** | Valid PDF-1.4 inline viewing (`/view`) and direct download (`/download`). |
| **US-06** | Instructor Course Authoring | 5 | High | Sprint 1 | **Done** | REST APIs for course, lesson, and material creation with role guard. |
| **US-07** | Interactive Quiz Engine | 8 | High | Sprint 2 | **Done** | Multi-choice questions, hidden answer keys before submit, attempt stored. |
| **US-08** | Assignment Submission | 5 | High | Sprint 2 | **Done** | Multer PDF/DOCX dropzone, 15MB limit, on-time vs late detection. |
| **US-09 (NEW)** | **Course Discussion Forum (CR-001)** | **5** | **High (Added)** | **Sprint 2** | **Done** | **Course-specific Q&A, empty validation, instructor role pill, threaded replies.** |
| **US-10** | Instructor Grading Console | 5 | High | Sprint 3 | **Done** | Numerical marks (0 to max) and qualitative instructor feedback. |
| **US-11** | Weighted Scoring & BUG-001 Fix | 5 | High | Sprint 3 | **Done** | Question weights summed; proportional percentage calculation. |
| **US-12** | Automated Test Suite (TC01-TC15) | 5 | High | Sprint 3 | **Done** | Jest + Supertest test suite passes 15/15 integration tests. |
| **US-13** | Student Dashboard Analytics | 5 | Medium | Sprint 3 | **Done** | Enrolled courses overview, progress percentages, quick navigation. |
| **US-14** | User Profile Customization | 5 | Low *(Was Med)* | Icebox | **Deferred** | De-prioritized post-Sprint 1 to absorb Discussion Forum (CR-001). |
| **US-15** | Completion Certificates | 8 | Low | Icebox | **Deferred** | Deferred to post-MVP release cycle. |

---

## 4. Summary of Requirement Change & Velocity Balance

```text
Sprint 2 Velocity Rebalancing:
  Original Planned Scope:    US-07 (8 SP) + US-08 (5 SP) + Old US-09 Profile (5 SP) = 18 SP
  Scope Swapped Out:       - Old US-09 User Profile Customization                   = -5 SP
  Scope Swapped In (CR-01): + New US-09 Course Discussion Forum                     = +5 SP
  -----------------------------------------------------------------------------------------
  Final Committed Scope:     US-07 (8 SP) + US-08 (5 SP) + New US-09 Forum (5 SP)   = 18 SP
  Velocity Variance:         0 Story Points (Zero schedule slip, 100% capacity match)
```
