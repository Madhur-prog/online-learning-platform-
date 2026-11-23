require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

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
const allAssessments = require('./allAssessments');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnsphere';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // 1. Safe User Upsert (Preserve existing user IDs and records)
    console.log('[Seed] Ensuring demo users exist...');
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Password123!', salt);

    let instructor = await User.findOne({ email: 'instructor@learnsphere.com' });
    if (!instructor) {
      instructor = await User.create({
        name: 'Dr. Sarah Jenkins',
        email: 'instructor@learnsphere.com',
        passwordHash: demoPasswordHash,
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        bio: 'Associate Professor of Computer Science. Specializing in Web Technologies, Software Architecture, and Distributed Systems.'
      });
      console.log('  + Created instructor: Dr. Sarah Jenkins');
    } else {
      console.log('  = Preserved instructor: Dr. Sarah Jenkins (ID: ' + instructor._id + ')');
    }

    let student1 = await User.findOne({ email: 'student@learnsphere.com' });
    if (!student1) {
      student1 = await User.create({
        name: 'Alex Chen',
        email: 'student@learnsphere.com',
        passwordHash: demoPasswordHash,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: 'Junior Software Engineering student passionate about full-stack development and responsive web apps.'
      });
      console.log('  + Created student 1: Alex Chen');
    } else {
      console.log('  = Preserved student 1: Alex Chen (ID: ' + student1._id + ')');
    }

    let student2 = await User.findOne({ email: 'priya@learnsphere.com' });
    if (!student2) {
      student2 = await User.create({
        name: 'Priya Patel',
        email: 'priya@learnsphere.com',
        passwordHash: demoPasswordHash,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        bio: 'Computer Science sophomore exploring database normalization, backend services, and cloud engineering.'
      });
      console.log('  + Created student 2: Priya Patel');
    } else {
      console.log('  = Preserved student 2: Priya Patel (ID: ' + student2._id + ')');
    }

    // 2. Comprehensive 10-Course Catalog Specification (2 per category)
    console.log('\n[Seed] Ensuring 10 courses exist across 5 categories...');
    const catalogData = [
      // Category 1: Web Development
      {
        title: 'JavaScript Fundamentals',
        description: 'Master the core language of the modern web. Learn variables, lexical scoping, closures, asynchronous execution, promises, and modern ES6+ features with practical hands-on examples.',
        category: 'Web Development',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Introduction to JavaScript & Modern Execution Context',
            description: 'Understand how the JavaScript runtime engine parses scripts, memory allocation, and the call stack.',
            videoUrl: '/uploads/videos/javascript-lesson.mp4',
            duration: '12:30',
            order: 1
          },
          {
            title: 'Lexical Scopes, Closures & The Scope Chain',
            description: 'Deep dive into block scoping with let/const, function scoping, and how closures preserve variable environments.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '15:45',
            order: 2
          },
          {
            title: 'Asynchronous JavaScript: Promises & Event Loop',
            description: 'Learn how microtasks, macrotasks, async/await, and the event loop coordinate non-blocking I/O operations.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '18:10',
            order: 3
          }
        ],
        material: {
          title: 'JavaScript Core Handbook & Scoping Notes',
          fileName: 'javascript_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.24 MB'
        },
        quiz: {
          title: 'JavaScript Fundamentals & Lexical Scopes Quiz',
          description: 'Test your understanding of JavaScript variables, closures, event loop, and type coercion. Questions have weighted marks.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which keyword declares a block-scoped variable in modern ECMAScript (ES6)?',
              options: ['var', 'let', 'global', 'dim'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: '`let` and `const` have block scope in JavaScript, whereas `var` is function scoped.'
            },
            {
              questionText: 'What is the evaluated output of the expression `typeof null` in standard JavaScript?',
              options: ['"undefined"', '"null"', '"object"', '"number"'],
              correctOptionIndex: 2,
              marks: 2,
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
              marks: 2,
              explanation: 'A closure gives a function access to its outer scope even after the outer function has finished executing.'
            },
            {
              questionText: 'Which asynchronous mechanism queues a callback into the Microtask queue?',
              options: [
                'setTimeout(fn, 0)',
                'setImmediate(fn)',
                'Promise.resolve().then(fn)',
                'requestAnimationFrame(fn)'
              ],
              correctOptionIndex: 2,
              marks: 2,
              explanation: 'Promise handlers (.then/.catch/finally) are executed as microtasks, which drain before the next macrotask.'
            },
            {
              questionText: 'What is the result of evaluating `[1, 2] + [3, 4]` in JavaScript?',
              options: [
                '[1, 2, 3, 4]',
                '"1,23,4"',
                'NaN',
                'TypeError: cannot concatenate arrays'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'The plus operator converts both arrays to comma-separated strings and concatenates them into "1,23,4".'
            }
          ]
        },
        assignment: {
          title: 'Build an Interactive DOM Todo Application',
          description: 'Design and implement a clean, interactive Todo Application using vanilla JavaScript. Requirements: Add task, remove task, toggle completion, and persist tasks in localStorage or an array. Upload your source code report in PDF or DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Understanding the Event Loop and Microtask Execution Order',
          content: 'Could someone clarify why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`? I thought both were asynchronous queues.',
          reply: 'Great question, Alex! The event loop maintains separate queues: the Microtask queue (Promises, queueMicrotask) and the Macrotask queue (setTimeout, setInterval). The engine drains the entire microtask queue right after the current execution frame finishes, BEFORE picking up the next macrotask.'
        }
      },

      {
        title: 'Web Development Basics',
        description: 'From semantic HTML5 and modern CSS styling to client-server communications and HTTP request lifecycles. Build full responsive web layouts and modern web interfaces.',
        category: 'Web Development',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Semantic HTML5 Structure and Modern Standards',
            description: 'Organizing documents using semantic tags, accessibility best practices, and document tree structure.',
            videoUrl: '/uploads/videos/web-lesson.mp4',
            duration: '09:40',
            order: 1
          },
          {
            title: 'CSS Box Model, Flexbox & Responsive Layouts',
            description: 'Mastering flex layouts, margins, padding, box-sizing, and mobile responsive media queries.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '13:15',
            order: 2
          },
          {
            title: 'Client-Server Communication & Fetch API',
            description: 'Connecting frontend UI to backend HTTP JSON endpoints using fetch and handling state.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '14:50',
            order: 3
          }
        ],
        material: {
          title: 'Web Development Foundations & CSS Handbook',
          fileName: 'web_development_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.45 MB'
        },
        quiz: {
          title: 'Web Development Foundations Quiz',
          description: 'Assess your understanding of semantic HTML5, CSS layout engines, responsive breakpoints, and client-server HTTP lifecycles.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which HTML5 element is most appropriate for containing the primary navigational links of a website?',
              options: ['<section>', '<nav>', '<aside>', '<header>'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'The `<nav>` semantic element represents a section of a page that links to other pages or parts within the page.'
            },
            {
              questionText: 'Under standard CSS Box Model calculations with `box-sizing: border-box`, what does an element declared width include?',
              options: ['Content only', 'Content and margin', 'Content, padding, and border', 'Margin, padding, and border'],
              correctOptionIndex: 2,
              marks: 2,
              explanation: '`box-sizing: border-box` includes content, padding, and borders within the specified width and height.'
            },
            {
              questionText: 'Which CSS Flexbox property controls alignment of flex items along the cross-axis?',
              options: ['justify-content', 'align-items', 'flex-direction', 'flex-wrap'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '`justify-content` aligns items along the main axis, while `align-items` controls alignment along the cross axis.'
            },
            {
              questionText: 'What HTTP response status code indicates that the server successfully fulfilled the request and created a new resource?',
              options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'HTTP 201 Created signifies that the request succeeded and led to the creation of a new persistent resource.'
            },
            {
              questionText: 'What is the primary architectural purpose of responsive CSS media queries?',
              options: [
                'To encrypt stylesheets in production',
                'To apply styling rules conditionally based on device viewport dimensions and capabilities',
                'To compress raster image files automatically',
                'To validate HTML document syntax'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Media queries allow web developers to adapt styling rules to different screen sizes, orientations, and resolutions.'
            }
          ]
        },
        assignment: {
          title: 'Create a Responsive Product Landing Page',
          description: 'Implement a semantic, mobile-first responsive landing page with a navigation bar, hero banner, feature grid, and contact form. Submit your HTML/CSS report in PDF or DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Best practices: Responsive CSS Grid vs Flexbox layouts',
          content: 'When designing modern dashboards, when should we prefer CSS Grid over Flexbox? Is Grid always better for cards?',
          reply: 'Great topic! A rule of thumb: use Flexbox for content-first, one-dimensional flows (rows or columns, such as navbars and toolbars), and CSS Grid for layout-first, two-dimensional structures (such as card grids and complex page templates).'
        }
      },

      // Category 2: Programming
      {
        title: 'Python Programming',
        description: 'Comprehensive guide to Python for general-purpose programming, automation, data structures, object-oriented concepts, and clean coding best practices.',
        category: 'Programming',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Python Syntax, Variables & Dynamic Typing',
            description: 'Foundations of Python syntax, data types, string formatting, and standard console interactions.',
            videoUrl: '/uploads/videos/python-lesson.mp4',
            duration: '10:15',
            order: 1
          },
          {
            title: 'Data Structures: Lists, Tuples & Dictionaries',
            description: 'Manipulating collections efficiently with list comprehensions and dictionary mappings.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '14:20',
            order: 2
          },
          {
            title: 'Object-Oriented Programming in Python',
            description: 'Creating classes, constructors, methods, inheritance, and encapsulation principles in Python.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '16:40',
            order: 3
          }
        ],
        material: {
          title: 'Python Programming Syntax Cheat Sheet & Handbook',
          fileName: 'python_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.60 MB'
        },
        quiz: {
          title: 'Python Programming Core Concepts Quiz',
          description: 'Evaluate your mastery of Python data types, list comprehensions, object-oriented class structure, and error handling.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which built-in Python data structure represents an immutable, ordered sequence of elements?',
              options: ['List', 'Set', 'Tuple', 'Dictionary'],
              correctOptionIndex: 2,
              marks: 1,
              explanation: 'Tuples are ordered and immutable collections defined using parentheses `(1, 2, 3)`.'
            },
            {
              questionText: 'What is the evaluated output of the list comprehension `[x**2 for x in range(4)]` in Python 3?',
              options: ['[1, 4, 9, 16]', '[0, 1, 4, 9]', '[0, 2, 4, 6]', '[1, 2, 3, 4]'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '`range(4)` generates 0, 1, 2, 3. Squaring each yields `[0, 1, 4, 9]`.'
            },
            {
              questionText: 'In Python classes, what does the first parameter of an instance method traditionally named `self` represent?',
              options: [
                'The parent superclass',
                'The class definition itself',
                'The current object instance',
                'A global configuration dictionary'
              ],
              correctOptionIndex: 2,
              marks: 2,
              explanation: '`self` explicitly refers to the specific instance of the class calling the method.'
            },
            {
              questionText: 'Which keyword is used to handle exceptions in Python error management blocks?',
              options: ['catch', 'except', 'trap', 'rescue'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Python uses `try` and `except` blocks to catch and handle runtime exceptions.'
            },
            {
              questionText: 'How does a Python generator created with the `yield` keyword differ from a traditional function returning a list?',
              options: [
                'It executes compiled C code',
                'It generates values lazily on demand, conserving memory for large datasets',
                'It can only produce string data types',
                'It cannot take any parameters'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Generators yield items one at a time on demand rather than loading all values into RAM simultaneously.'
            }
          ]
        },
        assignment: {
          title: 'Build a Student Grade Management System',
          description: 'Develop a modular Python program to manage student records. Calculate averages, assign letter grades, identify top performers, and persist data in a file. Upload your script and report in PDF/DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Memory management and list comprehensions performance in Python',
          content: 'In Python 3, is a list comprehension always faster than map with a lambda function? How does memory allocation differ?',
          reply: 'Yes, in modern Python, list comprehensions are typically faster than map with lambda because comprehensions avoid the overhead of repeated Python function call stack frames at bytecode level.'
        }
      },

      {
        title: 'Java Programming',
        description: 'Master enterprise-grade object-oriented software engineering using Java. Learn JVM memory models, classes, inheritance, polymorphism, interfaces, exceptions, and the Java Collections Framework.',
        category: 'Programming',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Java Virtual Machine Architecture & Bytecode',
            description: 'Understanding JVM ClassLoader, Bytecode execution, heap vs stack memory, and garbage collection.',
            videoUrl: '/uploads/videos/java-lesson.mp4',
            duration: '11:30',
            order: 1
          },
          {
            title: 'Object-Oriented Principles: Inheritance & Polymorphism',
            description: 'Designing robust class hierarchies, method overriding, super keyword, and interface contracts.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '15:10',
            order: 2
          },
          {
            title: 'Java Collections Framework & Exception Handling',
            description: 'Working with ArrayList, HashMap, HashSet, generics, and checked versus unchecked exceptions.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '17:45',
            order: 3
          }
        ],
        material: {
          title: 'Java Object-Oriented Programming Handbook',
          fileName: 'java_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.75 MB'
        },
        quiz: {
          title: 'Java Object-Oriented Programming Quiz',
          description: 'Assess your understanding of JVM execution, object-oriented encapsulation, inheritance, the Collections Framework, and exception handling.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which component of the Java platform is directly responsible for executing compiled bytecode instructions on host operating systems?',
              options: ['JDK', 'JVM', 'JRE compiler only', 'JavaDoc'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'The Java Virtual Machine (JVM) interprets and JIT-compiles bytecode into native machine instructions.'
            },
            {
              questionText: 'What is the keyword used in Java to inherit a class from another superclass?',
              options: ['implements', 'extends', 'inherits', 'super'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'In Java, `extends` denotes class inheritance, whereas `implements` is used for interface contracts.'
            },
            {
              questionText: 'Which Java Collections interface guarantees that duplicate elements will not be permitted?',
              options: ['List', 'Set', 'Queue', 'Vector'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The `Set` interface (such as HashSet or TreeSet) models mathematical sets and contains no duplicate elements.'
            },
            {
              questionText: 'In Java exception handling, which block is guaranteed to execute regardless of whether an exception occurred or was caught?',
              options: ['catch', 'finally', 'finalize', 'handle'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The `finally` block always executes upon leaving a try-catch construct, making it ideal for cleanup code.'
            },
            {
              questionText: 'What is the key distinction between an Abstract Class and an Interface prior to Java 8?',
              options: [
                'Interfaces could hold mutable instance state variables',
                'Abstract classes could not define constructors',
                'A class can implement multiple interfaces but can only extend one abstract class',
                'Interfaces were compiled to native binary rather than bytecode'
              ],
              correctOptionIndex: 2,
              marks: 3,
              explanation: 'Java supports multiple interface implementation, but single class inheritance to avoid the diamond problem.'
            }
          ]
        },
        assignment: {
          title: 'Implement an Object-Oriented Banking System',
          description: 'Create a clean Java application featuring BankAccount, SavingsAccount, and CheckingAccount classes. Implement deposit, withdrawal, interest calculation, and custom InsufficientFundsException handling. Submit source code and UML diagram in PDF or DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'When to use Abstract Classes vs Interfaces in Java',
          content: 'With Java 8 default methods in interfaces, is there still a compelling reason to design abstract classes in modern codebases?',
          reply: 'Yes! Use abstract classes when you need to share state (instance fields) and constructors across related classes. Use interfaces to define common capabilities and contracts across unrelated types.'
        }
      },

      // Category 3: Database Management
      {
        title: 'Database Management Systems',
        description: 'Understand relational schemas, entity-relationship diagrams, SQL query optimization, transaction ACID properties, indexing, and modern data persistence models.',
        category: 'Database Management',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Relational Model & Relational Algebra Foundations',
            description: 'Core concepts of relations, tuples, attributes, candidate keys, and relational operations.',
            videoUrl: '/uploads/videos/database-lesson.mp4',
            duration: '11:50',
            order: 1
          },
          {
            title: 'SQL DDL, DML and Complex Joins',
            description: 'Writing robust SELECT queries with INNER JOIN, LEFT JOIN, GROUP BY, and aggregate calculations.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '17:35',
            order: 2
          },
          {
            title: 'Database Normalization: 1NF through BCNF',
            description: 'Eliminating insertion, update, and deletion anomalies through functional dependency analysis.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '19:00',
            order: 3
          }
        ],
        material: {
          title: 'SQL Joins & Normalization Reference Guide',
          fileName: 'sql_reference_guide.pdf',
          fileType: 'PDF',
          fileSize: '2.10 MB'
        },
        quiz: {
          title: 'Relational Database Design & SQL Quiz',
          description: 'Evaluate your knowledge of SQL DDL/DML, constraints, indexing, and referential integrity.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which SQL statement is used to retrieve data from a database table?',
              options: ['GET', 'EXTRACT', 'SELECT', 'PULL'],
              correctOptionIndex: 2,
              marks: 1,
              explanation: 'The SELECT statement is used to query data from one or more tables in SQL.'
            },
            {
              questionText: 'Which SQL clause is used to filter records according to specified conditions?',
              options: ['ORDER BY', 'WHERE', 'GROUP BY', 'LIMIT'],
              correctOptionIndex: 1,
              marks: 2,
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
              marks: 2,
              explanation: 'A Foreign Key prevents actions that would destroy links between tables and ensures valid references.'
            },
            {
              questionText: 'Which Normal Form eliminates partial functional dependencies on a composite primary key?',
              options: [
                'First Normal Form (1NF)',
                'Second Normal Form (2NF)',
                'Third Normal Form (3NF)',
                'Boyce-Codd Normal Form (BCNF)'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '2NF requires a relation to be in 1NF and have no non-prime attribute partially dependent on any candidate key.'
            },
            {
              questionText: 'What does the ACID "I" property ensure in database transaction processing?',
              options: [
                'Immediate persistence on non-volatile media',
                'Concurrent transactions execute without interfering with one another',
                'Index structures remain balanced during B-tree splits',
                'In-memory caching is invalidated after commit'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Isolation ensures concurrent execution of transactions results in a system state that would be obtained if transactions were executed sequentially.'
            }
          ]
        },
        assignment: {
          title: 'Relational Schema Normalization & Query Design',
          description: 'Analyze an unnormalized order-processing business dataset. Perform step-by-step normalization into 1NF, 2NF, and 3NF. Write the corresponding SQL DDL statements with appropriate primary and foreign key constraints. Submit a detailed PDF report.',
          dueDateDays: 21,
          maxMarks: 100
        },
        discussion: {
          title: 'Optimizing SQL Joins and B-tree Index Performance',
          content: 'When joining three large tables on foreign keys, how does the query planner decide between Hash Join and Nested Loop Join?',
          reply: 'The query optimizer assesses table cardinality, available statistics, and indexes. For large datasets without supporting indexes, Hash Join is chosen; if the inner table has an index on the join key, an Index Nested Loop join is usually faster.'
        }
      },

      {
        title: 'MongoDB Fundamentals',
        description: 'Explore NoSQL document database concepts with MongoDB. Master BSON document modeling, CRUD commands, aggregation pipelines, schema validation, and horizontal scaling strategies.',
        category: 'Database Management',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Document Database Architecture & BSON Storage',
            description: 'Core concepts of collections, JSON/BSON storage representation, ObjectId structure, and schema flexibility.',
            videoUrl: '/uploads/videos/mongodb-lesson.mp4',
            duration: '10:45',
            order: 1
          },
          {
            title: 'MongoDB CRUD Operations & Query Operators',
            description: 'Inserting, finding, filtering with $gt/$in, and atomic document updates using $set and $push operators.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '14:15',
            order: 2
          },
          {
            title: 'Aggregation Pipelines & Compound Indexing',
            description: 'Transforming document streams with $match, $group, $lookup, $sort, and building high-speed compound indexes.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '16:30',
            order: 3
          }
        ],
        material: {
          title: 'MongoDB NoSQL Architecture & Aggregation Handbook',
          fileName: 'mongodb_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.80 MB'
        },
        quiz: {
          title: 'MongoDB & NoSQL Document Model Quiz',
          description: 'Test your understanding of BSON documents, embedding vs referencing, indexing strategies, and aggregation pipeline stages.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'In what data format does MongoDB physically serialize and store documents on disk?',
              options: ['Pure ASCII JSON', 'Binary JSON (BSON)', 'XML Markup', 'Protocol Buffers'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'MongoDB stores documents in BSON (Binary JSON), which provides faster traversal and support for types like Date and ObjectId.'
            },
            {
              questionText: 'Which MongoDB query operator matches documents where a field value equals any value within a specified array?',
              options: ['$eq', '$in', '$all', '$exists'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '`$in` selects documents where the value of a field equals any value in the specified array.'
            },
            {
              questionText: 'When designing data models in MongoDB, which approach is most recommended for one-to-few relationships with tightly coupled data?',
              options: [
                'Normalize data across separate collections with foreign keys',
                'Embedding subdocuments directly inside the parent document',
                'Storing the data in an external cache',
                'Sharding the document across clusters'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Embedding subdocuments enables atomic single-document reads and writes for tightly coupled data.'
            },
            {
              questionText: 'Which aggregation pipeline stage is used to perform left outer join lookups across related collections?',
              options: ['$match', '$lookup', '$join', '$merge'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The `$lookup` stage performs an equality join to another collection in the same database.'
            },
            {
              questionText: 'What is the role of a Compound Index in MongoDB query optimization?',
              options: [
                'It indexes multiple collections simultaneously',
                'It creates an index spanning multiple fields in a specific order to support compound sorting and filtering',
                'It prevents duplicate collections from being created',
                'It automatically encrypts collection documents'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Compound indexes index multiple fields and follow the Equality, Sort, Range (ESR) rule for maximum performance.'
            }
          ]
        },
        assignment: {
          title: 'Design an E-Commerce Document Schema and Aggregation Pipeline',
          description: 'Design a scalable MongoDB schema for Products, Customers, and Orders. Write aggregation pipeline queries to calculate customer lifetime spend and top-selling products. Submit code and query outputs in PDF or DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Embedding vs Referencing documents in MongoDB data modeling',
          content: 'When should we embed comments inside a blog post document versus referencing a separate comments collection?',
          reply: 'Embed when the array size is bounded (e.g. up to 100 comments). If comments could grow into thousands (unbounded), referencing avoids the 16MB BSON document size limit and improves write performance.'
        }
      },

      // Category 4: Data Science
      {
        title: 'Introduction to Data Science',
        description: 'Learn the complete data science lifecycle: data acquisition, data cleaning with Pandas, exploratory data analysis, statistical hypothesis testing, and effective visualization.',
        category: 'Data Science',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'The Data Science Lifecycle & Problem Formulation',
            description: 'Defining analytical questions, data collection pipelines, ethics, and project milestones.',
            videoUrl: '/uploads/videos/datascience-lesson.mp4',
            duration: '11:20',
            order: 1
          },
          {
            title: 'Exploratory Data Analysis & Data Wrangling',
            description: 'Data cleaning with Pandas, handling missing data, outlier detection, and feature transformation.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '15:40',
            order: 2
          },
          {
            title: 'Statistical Inference & Data Visualization',
            description: 'Hypothesis testing, p-values, confidence intervals, and visualization design with Matplotlib.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '18:00',
            order: 3
          }
        ],
        material: {
          title: 'Data Science Foundations & Statistics Handbook',
          fileName: 'datascience_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.90 MB'
        },
        quiz: {
          title: 'Data Science Foundations & Statistics Quiz',
          description: 'Assess your knowledge of exploratory data analysis, Pandas manipulation, statistical distributions, and visualization principles.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'What is typically the most time-consuming phase in the real-world Data Science lifecycle?',
              options: ['Model deployment', 'Data cleaning and preprocessing (wrangling)', 'Choosing hyper-parameters', 'Presenting slides'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'Data cleaning and wrangling often consume 70-80% of project time due to raw data noise and missing values.'
            },
            {
              questionText: 'Which Pandas function is primarily used to compute descriptive statistical summaries (mean, std, min, max, quartiles) for numeric DataFrame columns?',
              options: ['df.info()', 'df.describe()', 'df.summary()', 'df.values()'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '`df.describe()` generates descriptive summary statistics for numerical columns in a Pandas DataFrame.'
            },
            {
              questionText: 'When a dataset exhibits high positive skewness with severe outliers, which measure of central tendency is most reliable?',
              options: ['Arithmetic Mean', 'Median', 'Mode', 'Range'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The median is robust against extreme outliers and skewed distributions, whereas the mean is distorted.'
            },
            {
              questionText: 'In statistical hypothesis testing, what does a p-value less than alpha (e.g. 0.05) indicate?',
              options: [
                'The data is 95% corrupted',
                'Reject the null hypothesis in favor of the alternative hypothesis',
                'Fail to reject the null hypothesis',
                'The model is 100% accurate'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'A p-value below the threshold provides sufficient evidence to reject the null hypothesis.'
            },
            {
              questionText: 'What type of data visualization is most effective for displaying the empirical distribution and outliers of a continuous numerical variable?',
              options: ['Pie chart', 'Box plot (box-and-whisker)', 'Line chart', 'Donut chart'],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Box plots display median, quartiles, and interquartile range (IQR) to highlight distribution spread and outliers.'
            }
          ]
        },
        assignment: {
          title: 'Exploratory Data Analysis Report on Real-World Dataset',
          description: 'Perform complete exploratory data analysis (EDA) on a provided dataset using Python/Pandas. Identify missing values, detect outliers, create 3 informative visualizations, and state key conclusions in a PDF report.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Handling missing values: Imputation vs Deletion trade-offs',
          content: 'When a numerical column has 15% missing entries, should we drop those rows or impute using median/mean?',
          reply: 'Dropping 15% of your sample could introduce severe selection bias and waste valuable data. Imputing with the median (or an iterative model-based imputer) is generally preferred unless data is Missing Completely at Random (MCAR).'
        }
      },

      {
        title: 'Machine Learning Basics',
        description: 'Understand core supervised and unsupervised machine learning algorithms. Master regression, classification, gradient descent optimization, regularization, and model evaluation metrics.',
        category: 'Data Science',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Supervised vs Unsupervised Learning Paradigms',
            description: 'Distinguishing regression, classification, clustering, dimensionality reduction, and evaluation splits.',
            videoUrl: '/uploads/videos/machinelearning-lesson.mp4',
            duration: '12:15',
            order: 1
          },
          {
            title: 'Linear Regression & Logistic Classification',
            description: 'Cost function formulation, Mean Squared Error, Sigmoid function, and Gradient Descent optimization.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '16:50',
            order: 2
          },
          {
            title: 'Model Evaluation: Precision, Recall & Cross-Validation',
            description: 'Confusion matrices, precision/recall trade-offs, ROC-AUC curves, and k-fold cross-validation.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '19:25',
            order: 3
          }
        ],
        material: {
          title: 'Machine Learning Algorithms & Evaluation Handbook',
          fileName: 'machinelearning_handbook.pdf',
          fileType: 'PDF',
          fileSize: '2.05 MB'
        },
        quiz: {
          title: 'Machine Learning Concepts & Evaluation Quiz',
          description: 'Test your understanding of classification algorithms, loss functions, overfitting mitigation, and evaluation metrics.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which class of machine learning algorithms learns patterns from data containing ground-truth target labels?',
              options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Self-supervised Clustering'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'Supervised learning algorithms map input features to known target outputs using labeled training datasets.'
            },
            {
              questionText: 'In an imbalanced binary classification scenario (e.g. fraud detection), why is raw Accuracy a misleading metric?',
              options: [
                'It cannot be computed mathematically',
                'A naive model predicting the majority class can show high accuracy while missing all positive cases',
                'Accuracy only applies to continuous regression models',
                'Loss functions cannot optimize accuracy'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'In 99% negative data, predicting negative 100% of the time yields 99% accuracy but 0% fraud detection.'
            },
            {
              questionText: 'What problem occurs when a model learns the training noise too closely and fails to generalize to unseen test data?',
              options: ['Underfitting', 'Overfitting', 'Gradient vanishing', 'Multicollinearity'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Overfitting occurs when a high-variance model captures idiosyncrasies in training data rather than underlying patterns.'
            },
            {
              questionText: 'What optimization algorithm is commonly used to minimize loss functions by taking iterative steps proportional to negative gradients?',
              options: ['Bubble Sort', 'Gradient Descent', 'Dijkstra Algorithm', 'Monte Carlo Tree Search'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Gradient Descent updates weights in the direction of the steepest decrease of the cost function.'
            },
            {
              questionText: 'What does the Bias-Variance Tradeoff describe in statistical machine learning?',
              options: [
                'The balance between hardware memory and disk storage',
                'The tradeoff between model underfitting due to oversimplification (high bias) and overfitting due to excessive sensitivity (high variance)',
                'The speed of training versus inference',
                'The ratio of training rows to test rows'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Optimal models strike a balance minimizing total error by managing bias (underfitting) and variance (overfitting).'
            }
          ]
        },
        assignment: {
          title: 'Implement a Predictive Classification Pipeline',
          description: 'Implement a complete binary classification model using Scikit-Learn. Split the dataset, train logistic regression and random forest models, compute Confusion Matrix, Precision, Recall, and ROC-AUC. Submit your report in PDF or DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Addressing the Bias-Variance Tradeoff in complex models',
          content: 'If our model achieves 99% accuracy on training data but drops to 74% on validation data, what concrete steps should we take?',
          reply: 'That is a clear sign of overfitting (high variance). Key remedies: introduce L2 regularization, simplify model complexity, add dropout (in neural nets), perform feature selection, or gather more training data.'
        }
      },

      // Category 5: Software Engineering
      {
        title: 'Software Engineering Fundamentals',
        description: 'Explore foundational software engineering paradigms: SDLC methodologies, software requirements specification (SRS), high cohesion and low coupling architectural principles, testing levels, and maintenance.',
        category: 'Software Engineering',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Software Development Life Cycle (SDLC) Models',
            description: 'Comparative analysis of Waterfall, V-Model, Iterative, and Evolutionary development lifecycles.',
            videoUrl: '/uploads/videos/software-engineering-lesson.mp4',
            duration: '10:50',
            order: 1
          },
          {
            title: 'Requirement Engineering & Software Architecture',
            description: 'Writing formal SRS documents, architectural patterns, separation of concerns, and SOLID principles.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '14:30',
            order: 2
          },
          {
            title: 'Software Verification, Validation & Quality Assurance',
            description: 'Unit, integration, system, and regression testing strategies; white-box versus black-box test coverage.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '16:15',
            order: 3
          }
        ],
        material: {
          title: 'Software Engineering Architecture & SDLC Handbook',
          fileName: 'software_engineering_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.85 MB'
        },
        quiz: {
          title: 'Software Engineering & Architecture Quiz',
          description: 'Test your understanding of SDLC phases, requirement specifications, architectural modularity, and testing hierarchies.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'What formal document serves as the contractual baseline between clients and developers specifying functional and non-functional requirements?',
              options: ['UML Class Diagram', 'Software Requirements Specification (SRS)', 'Git Commit Message', 'User Story Map'],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'An SRS document formally specifies the complete behavioral and non-functional expectations of a software system.'
            },
            {
              questionText: 'Which architectural quality attribute is characterized by elements within a single module working closely together to perform one focused responsibility?',
              options: ['High Coupling', 'High Cohesion', 'Dynamic Typing', 'Technical Debt'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'High cohesion ensures that classes or modules focus on a single, well-defined responsibility (Single Responsibility Principle).'
            },
            {
              questionText: 'In software architecture, why is Low Coupling between independent modules desirable?',
              options: [
                'It slows down compilation',
                'Changes in one module have minimal ripple effect on other modules, making the codebase maintainable',
                'It prevents multi-threading',
                'It forces code duplication'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Low coupling minimizes inter-module dependencies, allowing individual components to evolve independently.'
            },
            {
              questionText: 'What level of software testing focuses on verifying the communication and data interface contracts between integrated modules?',
              options: ['Unit Testing', 'Integration Testing', 'Acceptance Testing', 'Smoke Testing'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Integration testing verifies that independently developed software units cooperate correctly through their interfaces.'
            },
            {
              questionText: 'What is the primary difference between Black-box Testing and White-box Testing?',
              options: [
                'Black-box tests hardware; White-box tests CSS',
                'Black-box is manual; White-box is automated',
                'Black-box tests functionality without internal code knowledge, whereas White-box tests internal logic and code paths',
                'Black-box is performed by developers; White-box is performed by users'
              ],
              correctOptionIndex: 2,
              marks: 3,
              explanation: 'Black-box verifies outputs against inputs; White-box requires structural inspection of branch and statement coverage.'
            }
          ]
        },
        assignment: {
          title: 'Author a Software Requirements Specification (SRS) Document',
          description: 'Prepare a professional IEEE 830-standard Software Requirements Specification (SRS) document for an online university examination portal. Detail scope, functional requirements, non-functional requirements, and system constraints in PDF/DOCX format.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'High cohesion and low coupling in clean architecture design',
          content: 'How can developers measure whether two services or classes are too tightly coupled? What are the warning signs?',
          reply: 'Warning signs include: having to import internal private classes across modules, changes in service A breaking service B tests, circular dependencies, and classes that cannot be tested without extensive mocking of unrelated modules.'
        }
      },

      {
        title: 'Agile Software Development',
        description: 'Comprehensive study of Agile principles and the Scrum framework. Learn sprint planning, user story sizing, product backlog management, handling requirement changes, and sprint retrospectives.',
        category: 'Software Engineering',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
        lessons: [
          {
            title: 'Agile Manifesto Values & Principles',
            description: 'Analyzing the 4 core values and 12 principles prioritizing working software and customer responsiveness.',
            videoUrl: '/uploads/videos/agile-lesson.mp4',
            duration: '11:40',
            order: 1
          },
          {
            title: 'Scrum Framework: Ceremonies, Roles & Artifacts',
            description: 'Understanding Product Owner, Scrum Master, Developers, Sprint Planning, Daily Scrums, Reviews, and Retrospectives.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '15:20',
            order: 2
          },
          {
            title: 'Backlog Refinement, User Stories & Story Point Estimation',
            description: 'Writing Given-When-Then acceptance criteria, estimating with Fibonacci numbers, and handling scope change requests.',
            videoUrl: '/uploads/videos/sample-lesson.mp4',
            duration: '17:50',
            order: 3
          }
        ],
        material: {
          title: 'Agile & Scrum Framework Mastery Handbook',
          fileName: 'agile_software_development_handbook.pdf',
          fileType: 'PDF',
          fileSize: '1.95 MB'
        },
        quiz: {
          title: 'Agile & Scrum Framework Mastery Quiz',
          description: 'Evaluate your knowledge of the Agile Manifesto, Scrum ceremonies, velocity capacity estimation, and handling mid-sprint requirement changes.',
          passingPercentage: 60,
          questions: [
            {
              questionText: 'Which statement represents one of the four foundational core values of the Agile Manifesto?',
              options: [
                'Following a contract over customer satisfaction',
                'Responding to change over following a plan',
                'Comprehensive documentation over working software',
                'Processes and tools over individuals'
              ],
              correctOptionIndex: 1,
              marks: 1,
              explanation: 'The Agile Manifesto values "Responding to change over following a plan" as essential for delivering true customer value.'
            },
            {
              questionText: 'In the Scrum framework, who is singularly accountable for managing and prioritizing the Product Backlog to maximize product value?',
              options: ['Scrum Master', 'Product Owner', 'Lead Software Architect', 'Project Sponsor'],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The Product Owner is responsible for maximizing product value and managing the transparent Product Backlog.'
            },
            {
              questionText: 'What is the primary purpose of the Sprint Retrospective ceremony?',
              options: [
                'To demonstrate the increment to external stakeholders',
                'To inspect team performance regarding individuals, interactions, processes, and tools and identify actionable improvements',
                'To assign story points to new backlog items',
                'To audit developer timecards'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'The Retrospective focuses on continuous internal team process improvement.'
            },
            {
              questionText: 'How do Agile teams measure relative effort and complexity when sizing user stories?',
              options: [
                'Exact developer calendar hours',
                'Story Points using modified Fibonacci sequences',
                'Number of code lines written',
                'Number of Git branches created'
              ],
              correctOptionIndex: 1,
              marks: 2,
              explanation: 'Story Points reflect relative complexity, effort, and uncertainty rather than deterministic hours.'
            },
            {
              questionText: 'When a high-priority requirement change is introduced after a sprint review, how does an Agile team accommodate it without slipping release dates?',
              options: [
                'By forcing developers to work mandatory overtime',
                'By reprioritizing the backlog and deferring lower-priority scope to maintain velocity capacity',
                'By skipping automated testing',
                'By ignoring the stakeholder change request'
              ],
              correctOptionIndex: 1,
              marks: 3,
              explanation: 'Agile teams manage scope flexibly: when a high-priority story is added, non-essential scope is deferred to maintain fixed dates.'
            }
          ]
        },
        assignment: {
          title: 'Build a Product Backlog & Sprint Plan for an Agile Project',
          description: 'Create an Agile project release plan: formulate 10 user stories with Gherkin acceptance criteria, assign story points, define Sprint 1 and Sprint 2 plans, and document a requirement change scenario (CR-001) with scope trade-offs. Submit as a PDF report.',
          dueDateDays: 14,
          maxMarks: 100
        },
        discussion: {
          title: 'Managing unexpected requirement changes during active sprints',
          content: 'If an external stakeholder requests a major feature in the middle of Sprint 2, should the team stop the sprint immediately?',
          reply: 'Under Scrum, active sprint goals should remain protected unless the sprint goal becomes completely obsolete (which warrants a Sprint Cancellation by the Product Owner). Otherwise, the PO captures the request, refines it in backlog grooming, and schedules it for the next sprint.'
        }
      }
    ];

    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const materialsDir = path.join(__dirname, '..', 'uploads', 'materials');

    // Process each course idempotently
    for (const cData of catalogData) {
      let course = await Course.findOne({ title: cData.title });
      if (!course) {
        course = await Course.create({
          title: cData.title,
          description: cData.description,
          instructorId: instructor._id,
          category: cData.category,
          thumbnail: cData.thumbnail,
          level: cData.level
        });
        console.log(`  + Created course: [${cData.category}] "${cData.title}"`);
      } else {
        // Update category/level/description if needed to ensure consistency
        course.category = cData.category;
        course.description = cData.description;
        course.thumbnail = cData.thumbnail;
        course.level = cData.level;
        await course.save();
        console.log(`  = Preserved course: [${cData.category}] "${cData.title}" (ID: ${course._id})`);
      }

      // Lessons: ensure at least 3 lessons exist
      const existingLessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
      for (const lData of cData.lessons) {
        const found = existingLessons.find(l => l.order === lData.order || l.title === lData.title);
        if (!found) {
          await Lesson.create({
            courseId: course._id,
            title: lData.title,
            description: lData.description,
            videoUrl: lData.videoUrl,
            duration: lData.duration,
            order: lData.order
          });
          console.log(`    + Added lesson: "${lData.title}"`);
        } else {
          // Ensure valid videoUrl
          if (found.videoUrl.includes('commondatastorage') || !found.videoUrl) {
            found.videoUrl = lData.videoUrl;
            await found.save();
          }
        }
      }

      // Study Material: ensure valid PDF material exists
      let material = await StudyMaterial.findOne({ courseId: course._id, fileType: 'PDF' });
      const targetPdfPath = path.join(materialsDir, cData.material.fileName);
      if (!material) {
        const firstLesson = await Lesson.findOne({ courseId: course._id }).sort({ order: 1 });
        await StudyMaterial.create({
          courseId: course._id,
          lessonId: firstLesson ? firstLesson._id : null,
          title: cData.material.title,
          filePath: targetPdfPath,
          originalFileName: cData.material.fileName,
          fileType: 'PDF',
          fileSize: cData.material.fileSize
        });
        console.log(`    + Added study material: "${cData.material.title}"`);
      } else {
        // Verify filePath points to valid existing file
        if (!fs.existsSync(material.filePath) || !material.filePath.endsWith('.pdf')) {
          material.filePath = targetPdfPath;
          material.originalFileName = cData.material.fileName;
          material.fileType = 'PDF';
          await material.save();
        }
      }

      // Quiz: ensure quiz exists with 5 MCQs
      let quiz = await Quiz.findOne({ courseId: course._id });
      if (!quiz) {
        await Quiz.create({
          courseId: course._id,
          title: cData.quiz.title,
          description: cData.quiz.description,
          passingPercentage: cData.quiz.passingPercentage,
          questions: cData.quiz.questions
        });
        console.log(`    + Added quiz: "${cData.quiz.title}" (5 questions)`);
      } else if (quiz.questions.length < 5) {
        quiz.questions = cData.quiz.questions;
        quiz.passingPercentage = cData.quiz.passingPercentage;
        await quiz.save();
        console.log(`    ~ Updated quiz questions: "${quiz.title}" (Now 5 questions)`);
      }

      // Assignment: ensure assignment exists
      let assignment = await Assignment.findOne({ courseId: course._id });
      if (!assignment) {
        await Assignment.create({
          courseId: course._id,
          title: cData.assignment.title,
          description: cData.assignment.description,
          dueDate: new Date(Date.now() + cData.assignment.dueDateDays * 24 * 60 * 60 * 1000),
          maxMarks: cData.assignment.maxMarks
        });
        console.log(`    + Added assignment: "${cData.assignment.title}"`);
      }

      // Discussion: ensure at least 1 discussion exists
      let discussion = await Discussion.findOne({ courseId: course._id });
      if (!discussion) {
        const disc = await Discussion.create({
          courseId: course._id,
          authorId: student1._id,
          title: cData.discussion.title,
          content: cData.discussion.content
        });
        await Reply.create({
          discussionId: disc._id,
          authorId: instructor._id,
          content: cData.discussion.reply
        });
        console.log(`    + Added discussion thread & reply: "${cData.discussion.title}"`);
      }
    }

    // 3. Ensure Student 1 is enrolled in core demo courses without breaking existing records
    console.log('\n[Seed] Ensuring student enrollments...');
    const demoEnrollTitles = ['JavaScript Fundamentals', 'Python Programming', 'Web Development Basics'];
    for (const title of demoEnrollTitles) {
      const crs = await Course.findOne({ title });
      if (crs) {
        const exists = await Enrollment.findOne({ studentId: student1._id, courseId: crs._id });
        if (!exists) {
          const firstLesson = await Lesson.findOne({ courseId: crs._id }).sort({ order: 1 });
          await Enrollment.create({
            studentId: student1._id,
            courseId: crs._id,
            progress: 33,
            completedLessons: firstLesson ? [firstLesson._id] : []
          });
          console.log(`  + Enrolled Alex Chen in "${title}"`);
        }
      }
    }

    // Ensure Student 2 (Priya) is enrolled in Database Management Systems & Data Science
    const priyaEnrollTitles = ['Database Management Systems', 'Introduction to Data Science'];
    for (const title of priyaEnrollTitles) {
      const crs = await Course.findOne({ title });
      if (crs) {
        const exists = await Enrollment.findOne({ studentId: student2._id, courseId: crs._id });
        if (!exists) {
          const firstLesson = await Lesson.findOne({ courseId: crs._id }).sort({ order: 1 });
          await Enrollment.create({
            studentId: student2._id,
            courseId: crs._id,
            progress: 33,
            completedLessons: firstLesson ? [firstLesson._id] : []
          });
          console.log(`  + Enrolled Priya Patel in "${title}"`);
        }
      }
    }

    // 4. Ensure demo assignment submission exists for Alex Chen in JavaScript Fundamentals
    const jsCourse = await Course.findOne({ title: 'JavaScript Fundamentals' });
    const jsAssign = await Assignment.findOne({ courseId: jsCourse._id });
    if (jsAssign) {
      let sub = await Submission.findOne({ assignmentId: jsAssign._id, studentId: student1._id });
      if (!sub) {
        await Submission.create({
          assignmentId: jsAssign._id,
          studentId: student1._id,
          courseId: jsCourse._id,
          filePath: path.join(__dirname, '..', 'uploads', 'assignments', 'student_todo_submission.pdf'),
          originalFileName: 'alex_chen_dom_todo_assignment.pdf',
          fileType: 'PDF',
          fileSize: 1024 * 180,
          status: 'Graded',
          marks: 92,
          feedback: 'Excellent work Alex! Clean code structure, thoughtful event listener delegation, and thorough edge case handling.'
        });
        console.log('  + Created demo submission for Alex Chen in JavaScript Fundamentals');
      }
    }

    // Ensure all 3 quizzes and 3 assignments exist per course
    console.log('\n[Seed] Ensuring 3 quizzes and 3 assignments exist for all courses...');
    for (const cData of allAssessments) {
      const crs = await Course.findOne({ title: cData.courseTitle });
      if (!crs) continue;

      for (const qData of cData.quizzes) {
        let q = await Quiz.findOne({ courseId: crs._id, difficulty: qData.difficulty });
        if (!q) {
          await Quiz.create({
            courseId: crs._id,
            title: qData.title,
            description: qData.description,
            difficulty: qData.difficulty,
            passingPercentage: qData.passingPercentage,
            questions: qData.questions
          });
        }
      }

      for (const aData of cData.assignments) {
        let a = await Assignment.findOne({ courseId: crs._id, difficulty: aData.difficulty });
        if (!a) {
          await Assignment.create({
            courseId: crs._id,
            title: aData.title,
            description: aData.description,
            difficulty: aData.difficulty,
            dueDate: new Date(Date.now() + aData.dueDateDays * 24 * 60 * 60 * 1000),
            maxMarks: aData.maxMarks
          });
        }
      }
    }

    console.log('\n======================================================');
    console.log(' [LearnSphere] Safe Idempotent Seed Completed Successfully!');
    console.log('======================================================');
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalMaterials = await StudyMaterial.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalDiscussions = await Discussion.countDocuments();
    console.log(`Current Totals in Database:`);
    console.log(`  - Courses: ${totalCourses} (across 5 categories)`);
    console.log(`  - Lessons: ${totalLessons}`);
    console.log(`  - Study Materials: ${totalMaterials}`);
    console.log(`  - Quizzes: ${totalQuizzes}`);
    console.log(`  - Assignments: ${totalAssignments}`);
    console.log(`  - Discussions: ${totalDiscussions}`);
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
