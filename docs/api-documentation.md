# LearnSphere - REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require an HTTP Authorization header in the format:
```text
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### Register User
- **Method:** `POST`
- **Route:** `/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Alex Chen",
    "email": "student@learnsphere.com",
    "password": "Password123!",
    "role": "student"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "674123456789abcdef012345",
      "name": "Alex Chen",
      "email": "student@learnsphere.com",
      "role": "student"
    }
  }
  ```

### Login User
- **Method:** `POST`
- **Route:** `/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "student@learnsphere.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK):** Returns JWT token and user profile object.

### Get Current User Profile
- **Method:** `GET`
- **Route:** `/auth/me`
- **Access:** Private (Bearer Token)
- **Success Response (200 OK):** Returns current authenticated user record without password hash.

---

## 2. Course Endpoints

### Get All Courses
- **Method:** `GET`
- **Route:** `/courses?category=Web%20Development&search=JavaScript`
- **Access:** Public
- **Success Response (200 OK):** List of courses enriched with `lessonCount` and `enrolledCount`.

### Get Single Course by ID
- **Method:** `GET`
- **Route:** `/courses/:id`
- **Access:** Public (Optional Bearer token for enrollment status)
- **Success Response (200 OK):** Full course object with lessons, study materials, quizzes, and assignments.

### Create Course
- **Method:** `POST`
- **Route:** `/courses`
- **Access:** Private (Instructor Only)
- **Request Body:**
  ```json
  {
    "title": "Machine Learning Fundamentals",
    "description": "Core algorithms in supervised learning.",
    "category": "Data Science",
    "level": "Intermediate",
    "thumbnail": "https://images.unsplash.com/photo-..."
  }
  ```

### Enroll in Course
- **Method:** `POST`
- **Route:** `/courses/:id/enroll`
- **Access:** Private (Student Only)
- **Success Response (201 Created):** Enrollment document saved with `progress: 0`.

### Update Lesson Progress
- **Method:** `POST`
- **Route:** `/courses/:id/progress`
- **Access:** Private (Student Only)
- **Request Body:** `{ "lessonId": "6741..." }`
- **Success Response (200 OK):** Returns updated percentage progress.

---

## 3. Lesson Endpoints

### Get Course Lessons
- **Method:** `GET`
- **Route:** `/courses/:id/lessons`
- **Access:** Public

### Get Single Lesson by ID
- **Method:** `GET`
- **Route:** `/lessons/:id`
- **Access:** Private (Authenticated Users)
- **Success Response (200 OK):** Returns lesson videoUrl, title, order, and attached study materials.

### Add Lesson to Course
- **Method:** `POST`
- **Route:** `/courses/:id/lessons`
- **Access:** Private (Instructor Only)
- **Request Body:**
  ```json
  {
    "title": "Event Loop and Microtasks",
    "videoUrl": "https://commondatastorage.googleapis.com/.../sample.mp4",
    "duration": "14:20",
    "order": 3
  }
  ```

---

## 4. Study Materials Endpoints

### Get Materials for Course
- **Method:** `GET`
- **Route:** `/courses/:id/materials`
- **Access:** Private

### Upload Study Material
- **Method:** `POST`
- **Route:** `/courses/:id/materials`
- **Access:** Private (Instructor Only)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `title`, `lessonId` (optional), `file` (PDF, DOCX, PPTX).

### Download Study Material
- **Method:** `GET`
- **Route:** `/materials/:id/download`
- **Access:** Private (Authenticated Users)
- **Response:** File attachment stream.

---

## 5. Quiz Assessment Endpoints

### Get Course Quizzes
- **Method:** `GET`
- **Route:** `/courses/:id/quizzes`
- **Access:** Private (Hides `correctOptionIndex` from students).

### Get Single Quiz
- **Method:** `GET`
- **Route:** `/quizzes/:id`
- **Access:** Private (Hides correct answers until student has submitted an attempt).

### Submit Quiz Attempt (Backend Scored)
- **Method:** `POST`
- **Route:** `/quizzes/:id/submit`
- **Access:** Private (Student Only)
- **Request Body:**
  ```json
  {
    "answers": [
      { "questionIndex": 0, "selectedOptionIndex": 1 },
      { "questionIndex": 1, "selectedOptionIndex": 2 }
    ]
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "attemptId": "6741...",
    "result": {
      "quizTitle": "JavaScript Fundamentals Quiz",
      "score": 7,
      "totalMarks": 10,
      "percentage": 70,
      "passed": true
    }
  }
  ```

### Get Quiz Result Breakdown
- **Method:** `GET`
- **Route:** `/quizzes/attempts/:attemptId`
- **Access:** Private (Self or Course Instructor). Enforces TC10 security guard.

---

## 6. Coursework Assignment Endpoints

### Get Course Assignments
- **Method:** `GET`
- **Route:** `/courses/:id/assignments`
- **Access:** Private

### Submit Assignment
- **Method:** `POST`
- **Route:** `/assignments/:id/submit`
- **Access:** Private (Student Only)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `file` (PDF, DOCX up to 15MB).
- **Success Response (200 OK):** Tagged as `Submitted` or `Late`.

### Get Assignment Submissions
- **Method:** `GET`
- **Route:** `/assignments/:id/submissions`
- **Access:** Private (Instructor Only)

### Grade Student Submission
- **Method:** `PUT`
- **Route:** `/submissions/:id/grade`
- **Access:** Private (Instructor Only)
- **Request Body:**
  ```json
  {
    "marks": 95,
    "feedback": "Outstanding architectural structure and thorough test coverage."
  }
  ```

---

## 7. Course Discussion Forum Endpoints (Sprint 2 Requirement Change)

### Get Course Discussion Threads
- **Method:** `GET`
- **Route:** `/courses/:id/discussions`
- **Access:** Private (Enrolled Students & Course Instructor)

### Create Discussion Question
- **Method:** `POST`
- **Route:** `/courses/:id/discussions`
- **Access:** Private (Enrolled Students & Course Instructor)
- **Request Body:**
  ```json
  {
    "title": "When does setTimeout execute in relation to Promises?",
    "content": "I noticed microtasks run first before macrotasks in the event loop."
  }
  ```
- **Validation:** Rejects empty title or content with `400 Bad Request`.

### Get Thread Replies
- **Method:** `GET`
- **Route:** `/discussions/:id/replies`
- **Access:** Private

### Post Reply to Thread
- **Method:** `POST`
- **Route:** `/discussions/:id/replies`
- **Access:** Private (Enrolled Students & Course Instructor)
- **Request Body:**
  ```json
  {
    "content": "Correct! Microtasks have priority over macrotasks after the call stack clears."
  }
  ```
- **Validation:** Rejects empty content with `400 Bad Request`.
