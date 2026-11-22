require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

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

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // Clear existing data to ensure repeatability
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      StudyMaterial.deleteMany({}),
      Quiz.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Discussion.deleteMany({}),
      Reply.deleteMany({})
    ]);

    // 1. Create Users
    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Password123!', salt);

    const instructor = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'instructor@learnsphere.com',
      passwordHash: demoPasswordHash,
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      bio: 'Associate Professor of Computer Science. Specializing in Web Technologies, Software Architecture, and Distributed Systems.'
    });

    const student1 = await User.create({
      name: 'Alex Chen',
      email: 'student@learnsphere.com',
      passwordHash: demoPasswordHash,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bio: 'Junior Software Engineering student passionate about full-stack development and responsive web apps.'
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@learnsphere.com',
      passwordHash: demoPasswordHash,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      bio: 'Computer Science sophomore exploring database normalization, backend services, and cloud engineering.'
    });

    // 2. Create Courses
    console.log('[Seed] Creating courses...');
    const coursesData = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Master the core language of the modern web. Learn variables, lexical scoping, closures, asynchronous execution, promises, and modern ES6+ features with practical hands-on examples.',
        category: 'Web Development',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
        instructorId: instructor._id
      },
      {
        title: 'Python Programming',
        description: 'Comprehensive guide to Python for general-purpose programming, automation, data structures, object-oriented concepts, and clean coding best practices.',
        category: 'Programming',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
        instructorId: instructor._id
      },
      {
        title: 'Database Management Systems',
        description: 'Understand relational schemas, entity-relationship diagrams, SQL query optimization, transaction ACID properties, indexing, and modern data persistence models.',
        category: 'Database Management',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
        instructorId: instructor._id
      },
      {
        title: 'Web Development Basics',
        description: 'From semantic HTML5 and modern CSS styling to client-server communications and HTTP request lifecycles. Build full responsive web layouts and modern web interfaces.',
        category: 'Web Development',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
        instructorId: instructor._id
      }
    ];

    const courses = await Course.insertMany(coursesData);
    const [jsCourse, pyCourse, dbCourse, webCourse] = courses;

    // 3. Create Lessons (3 per course with real accessible public sample videos)
    console.log('[Seed] Creating lessons...');
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ];

    // JavaScript Lessons
    const jsLessons = await Lesson.insertMany([
      {
        courseId: jsCourse._id,
        title: 'Introduction to JavaScript & Modern Execution Context',
        description: 'Understand how the JavaScript runtime engine parses scripts, memory allocation, and the call stack.',
        videoUrl: sampleVideos[0],
        duration: '12:30',
        order: 1
      },
      {
        courseId: jsCourse._id,
        title: 'Lexical Scopes, Closures & The Scope Chain',
        description: 'Deep dive into block scoping with let/const, function scoping, and how closures preserve variable environments.',
        videoUrl: sampleVideos[1],
        duration: '15:45',
        order: 2
      },
      {
        courseId: jsCourse._id,
        title: 'Asynchronous JavaScript: Promises & Event Loop',
        description: 'Learn how microtasks, macrotasks, async/await, and the event loop coordinate non-blocking I/O operations.',
        videoUrl: sampleVideos[2],
        duration: '18:10',
        order: 3
      }
    ]);

    // Python Lessons
    const pyLessons = await Lesson.insertMany([
      {
        courseId: pyCourse._id,
        title: 'Python Syntax, Variables & Dynamic Typing',
        description: 'Foundations of Python syntax, data types, string formatting, and standard console interactions.',
        videoUrl: sampleVideos[0],
        duration: '10:15',
        order: 1
      },
      {
        courseId: pyCourse._id,
        title: 'Data Structures: Lists, Tuples & Dictionaries',
        description: 'Manipulating collections efficiently with list comprehensions and dictionary mappings.',
        videoUrl: sampleVideos[1],
        duration: '14:20',
        order: 2
      },
      {
        courseId: pyCourse._id,
        title: 'Object-Oriented Programming in Python',
        description: 'Creating classes, constructors, methods, inheritance, and encapsulation principles in Python.',
        videoUrl: sampleVideos[2],
        duration: '16:40',
        order: 3
      }
    ]);

    // DBMS Lessons
    const dbLessons = await Lesson.insertMany([
      {
        courseId: dbCourse._id,
        title: 'Relational Model & Relational Algebra Foundations',
        description: 'Core concepts of relations, tuples, attributes, candidate keys, and relational operations.',
        videoUrl: sampleVideos[0],
        duration: '11:50',
        order: 1
      },
      {
        courseId: dbCourse._id,
        title: 'SQL DDL, DML and Complex Joins',
        description: 'Writing robust SELECT queries with INNER JOIN, LEFT JOIN, GROUP BY, and aggregate calculations.',
        videoUrl: sampleVideos[1],
        duration: '17:35',
        order: 2
      },
      {
        courseId: dbCourse._id,
        title: 'Database Normalization: 1NF through BCNF',
        description: 'Eliminating insertion, update, and deletion anomalies through functional dependency analysis.',
        videoUrl: sampleVideos[2],
        duration: '19:00',
        order: 3
      }
    ]);

    // Web Dev Lessons
    const webLessons = await Lesson.insertMany([
      {
        courseId: webCourse._id,
        title: 'Semantic HTML5 Structure and Modern Standards',
        description: 'Organizing documents using semantic tags, accessibility best practices, and document tree structure.',
        videoUrl: sampleVideos[0],
        duration: '09:40',
        order: 1
      },
      {
        courseId: webCourse._id,
        title: 'CSS Box Model, Flexbox & Responsive Layouts',
        description: 'Mastering flex layouts, margins, padding, box-sizing, and mobile responsive media queries.',
        videoUrl: sampleVideos[1],
        duration: '13:15',
        order: 2
      },
      {
        courseId: webCourse._id,
        title: 'Client-Server Communication & Fetch API',
        description: 'Connecting frontend UI to backend HTTP JSON endpoints using fetch and handling state.',
        videoUrl: sampleVideos[2],
        duration: '14:50',
        order: 3
      }
    ]);

    // 4. Create Study Materials
    console.log('[Seed] Creating study materials...');
    await StudyMaterial.insertMany([
      {
        courseId: jsCourse._id,
        lessonId: jsLessons[0]._id,
        title: 'JavaScript Core Handbook & Scoping Notes',
        filePath: path.join(__dirname, '..', 'uploads', 'materials', 'javascript_handbook.pdf'),
        originalFileName: 'javascript_handbook.pdf',
        fileType: 'PDF',
        fileSize: '1.24 MB'
      },
      {
        courseId: pyCourse._id,
        lessonId: pyLessons[0]._id,
        title: 'Python Programming Syntax Cheat Sheet',
        filePath: path.join(__dirname, '..', 'uploads', 'materials', 'python_cheat_sheet.docx'),
        originalFileName: 'python_cheat_sheet.docx',
        fileType: 'DOCX',
        fileSize: '0.85 MB'
      },
      {
        courseId: dbCourse._id,
        lessonId: dbLessons[1]._id,
        title: 'SQL Joins and Normalization Reference Guide',
        filePath: path.join(__dirname, '..', 'uploads', 'materials', 'sql_reference_guide.pdf'),
        originalFileName: 'sql_reference_guide.pdf',
        fileType: 'PDF',
        fileSize: '2.10 MB'
      },
      {
        courseId: webCourse._id,
        lessonId: webLessons[2]._id,
        title: 'Web Architecture & HTTP Lifecycle Slide Deck',
        filePath: path.join(__dirname, '..', 'uploads', 'materials', 'web_architecture.pptx'),
        originalFileName: 'web_architecture.pptx',
        fileType: 'PPTX',
        fileSize: '3.40 MB'
      }
    ]);

    // 5. Create Quizzes with Weighted Questions (Notice marks per question)
    console.log('[Seed] Creating quizzes with weighted question marks...');
    const jsQuiz = await Quiz.create({
      courseId: jsCourse._id,
      title: 'JavaScript Fundamentals & Lexical Scopes Quiz',
      description: 'Test your understanding of JavaScript variables, closures, and type coercion. Questions have weighted marks.',
      passingPercentage: 60,
      questions: [
        {
          questionText: 'Which keyword declares a block-scoped variable in modern ECMAScript (ES6)?',
          options: ['var', 'let', 'global', 'dim'],
          correctOptionIndex: 1,
          marks: 2,
          explanation: '`let` and `const` have block scope in JavaScript, whereas `var` is function scoped.'
        },
        {
          questionText: 'What is the evaluated output of the expression `typeof null` in standard JavaScript?',
          options: ['"undefined"', '"null"', '"object"', '"number"'],
          correctOptionIndex: 2,
          marks: 3,
          explanation: 'In JavaScript, `typeof null === "object"` due to a legacy design quirk in the initial engine implementation.'
        },
        {
          questionText: 'What is a Closure in JavaScript?',
          options: [
            'A function bundled together with references to its surrounding lexical environment',
            'A syntax error that closes the Node.js runtime process',
            'A browser method used solely to close browser tabs',
            'A database connection pool termination handler'
          ],
          correctOptionIndex: 0,
          marks: 5,
          explanation: 'A closure gives a function access to its outer scope even after the outer function has finished executing.'
        }
      ]
    });

    const dbQuiz = await Quiz.create({
      courseId: dbCourse._id,
      title: 'Relational Database Design & SQL Quiz',
      description: 'Evaluate your knowledge of SQL DDL/DML, constraints, and referential integrity.',
      passingPercentage: 60,
      questions: [
        {
          questionText: 'Which SQL statement is used to retrieve data from a database table?',
          options: ['GET', 'EXTRACT', 'SELECT', 'PULL'],
          correctOptionIndex: 2,
          marks: 2,
          explanation: 'The SELECT statement is used to query data from one or more tables in SQL.'
        },
        {
          questionText: 'Which SQL clause is used to filter records according to specified conditions?',
          options: ['ORDER BY', 'WHERE', 'GROUP BY', 'LIMIT'],
          correctOptionIndex: 1,
          marks: 3,
          explanation: 'The WHERE clause specifies search conditions for rows returned by a query.'
        },
        {
          questionText: 'What is the primary architectural purpose of a Foreign Key constraint?',
          options: [
            'To encrypt sensitive table columns',
            'To enforce referential integrity between related tables',
            'To automatically partition large database tables',
            'To eliminate all indexes on the child table'
          ],
          correctOptionIndex: 1,
          marks: 5,
          explanation: 'A Foreign Key prevents actions that would destroy links between tables and ensures valid references.'
        }
      ]
    });

    // 6. Create Assignments
    console.log('[Seed] Creating course assignments...');
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const inThreeWeeks = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

    const jsAssignment = await Assignment.create({
      courseId: jsCourse._id,
      title: 'Build an Interactive DOM Todo Application',
      description: 'Design and implement a clean, interactive Todo Application using vanilla JavaScript. Requirements: Add task, remove task, toggle completion, and persist tasks in localStorage or an array. Upload your source code report in PDF or DOCX format.',
      dueDate: inTwoWeeks,
      maxMarks: 100
    });

    const dbAssignment = await Assignment.create({
      courseId: dbCourse._id,
      title: 'Relational Schema Normalization & Query Design',
      description: 'Analyze an unnormalized order-processing business dataset. Perform step-by-step normalization into 1NF, 2NF, and 3NF. Write the corresponding SQL DDL statements with appropriate primary and foreign key constraints. Submit a detailed PDF report.',
      dueDate: inThreeWeeks,
      maxMarks: 100
    });

    // 7. Create Student Enrollments
    console.log('[Seed] Creating student enrollments...');
    // Alex Chen enrolled in JavaScript Fundamentals (completed lesson 1, progress 33%)
    await Enrollment.create({
      studentId: student1._id,
      courseId: jsCourse._id,
      progress: 33,
      completedLessons: [jsLessons[0]._id],
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });

    // Priya Patel enrolled in Database Management Systems (completed lesson 1 & 2, progress 67%)
    await Enrollment.create({
      studentId: student2._id,
      courseId: dbCourse._id,
      progress: 67,
      completedLessons: [dbLessons[0]._id, dbLessons[1]._id],
      enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Alex also enrolled in Web Development Basics (progress 0%)
    await Enrollment.create({
      studentId: student1._id,
      courseId: webCourse._id,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // 8. Create a sample assignment submission for Alex Chen in JS Course
    console.log('[Seed] Creating assignment submission...');
    await Submission.create({
      assignmentId: jsAssignment._id,
      studentId: student1._id,
      courseId: jsCourse._id,
      filePath: path.join(__dirname, '..', 'uploads', 'assignments', 'student_todo_submission.pdf'),
      originalFileName: 'alex_chen_dom_todo_assignment.pdf',
      fileType: 'PDF',
      fileSize: 1024 * 180,
      status: 'Graded',
      marks: 92,
      feedback: 'Excellent work Alex! Clean code structure, thoughtful event listener delegation, and thorough edge case handling.',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // 9. Create Course Discussions & Replies (Requirement added after Sprint 1)
    console.log('[Seed] Creating discussion forum threads and replies...');
    const thread1 = await Discussion.create({
      courseId: jsCourse._id,
      authorId: student1._id,
      title: 'Understanding the Event Loop and Microtask Execution Order',
      content: 'Could someone clarify why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`? I thought both were asynchronous queues.',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    });

    await Reply.create({
      discussionId: thread1._id,
      authorId: instructor._id,
      content: 'Great question, Alex! The event loop maintains separate queues: the Microtask queue (Promises, queueMicrotask) and the Macrotask queue (setTimeout, setInterval). The engine drains the entire microtask queue right after the current execution frame finishes, BEFORE picking up the next macrotask.',
      createdAt: new Date(Date.now() - 44 * 60 * 60 * 1000)
    });

    await Reply.create({
      discussionId: thread1._id,
      authorId: student2._id,
      content: 'Thank you Dr. Jenkins! This makes complete sense why async/await microtasks always finish before setTimeout ticks.',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
    });

    const thread2 = await Discussion.create({
      courseId: jsCourse._id,
      authorId: student2._id,
      title: 'Best practices: When should we prefer `const` over `let`?',
      content: 'In modern JavaScript codebases, should we default to `const` even for objects and arrays whose properties we mutate?',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    await Reply.create({
      discussionId: thread2._id,
      authorId: instructor._id,
      content: 'Yes, exactly! `const` prevents reassignment of the variable identifier itself, not mutation of the object properties. By defaulting to `const`, you signal intent and prevent accidental variable re-binding.',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
    });

    console.log('\n======================================================');
    console.log(' [LearnSphere] Database Seed Completed Successfully!');
    console.log('======================================================');
    console.log('Demo Accounts Created:');
    console.log('  1) Instructor: instructor@learnsphere.com / Password123!');
    console.log('  2) Student 1:   student@learnsphere.com    / Password123!');
    console.log('  3) Student 2:   priya@learnsphere.com      / Password123!');
    console.log('Courses Seeded: 4 courses with 12 lessons, 4 study materials,');
    console.log('                2 quizzes, 2 assignments, and discussion threads.');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
