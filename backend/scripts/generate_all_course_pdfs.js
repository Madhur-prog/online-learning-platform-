const fs = require('fs');
const path = require('path');

function createCoursePdf(courseTitle, subtitle, pagesData) {
  // pagesData is array of pages: each page is array of lines
  const pages = [];
  const fonts = {
    '/F1': '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '/F2': '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '/F3': '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>'
  };

  const pageObjects = [];
  const contentObjects = [];

  pagesData.forEach((pageLines, pageIdx) => {
    let s = 'BT\n';
    if (pageIdx === 0) {
      s += '/F2 16 Tf\n50 740 Td\n(' + escapePdf(courseTitle) + ') Tj\n';
      s += '/F2 11 Tf\n0 -20 Td\n(' + escapePdf(subtitle) + ') Tj\n';
      s += '/F1 10 Tf\n0 -25 Td\n';
    } else {
      s += '/F2 13 Tf\n50 740 Td\n(' + escapePdf(courseTitle + ' (Continued)') + ') Tj\n';
      s += '/F1 10 Tf\n0 -25 Td\n';
    }

    for (const item of pageLines) {
      if (typeof item === 'string') {
        if (item.startsWith('## ')) {
          s += '/F2 12 Tf\n0 -16 Td\n(' + escapePdf(item.substring(3)) + ') Tj\n/F1 9.5 Tf\n0 -14 Td\n';
        } else if (item.startsWith('### ')) {
          s += '/F2 10.5 Tf\n0 -14 Td\n(' + escapePdf(item.substring(4)) + ') Tj\n/F1 9.5 Tf\n0 -12 Td\n';
        } else if (item.startsWith('> ')) {
          s += '/F3 9 Tf\n0 -12 Td\n(' + escapePdf(item.substring(2)) + ') Tj\n/F1 9.5 Tf\n0 -12 Td\n';
        } else if (item === '') {
          s += '0 -7 Td\n';
        } else {
          s += '(' + escapePdf(item) + ') Tj\n0 -12 Td\n';
        }
      }
    }
    s += 'ET';
    pages.push(s);
  });

  function escapePdf(str) {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  // Object numbering:
  // 1: Catalog
  // 2: Pages
  // Then for each page i:
  //   pageObj = 3 + i*2
  //   contentObj = 4 + i*2
  // After all pages:
  //   Font F1, F2, F3
  const numPages = pages.length;
  const fontStartObj = 3 + numPages * 2;
  const f1Obj = fontStartObj;
  const f2Obj = fontStartObj + 1;
  const f3Obj = fontStartObj + 2;
  const totalObjs = f3Obj;

  const kids = [];
  for (let i = 0; i < numPages; i++) {
    kids.push((3 + i * 2) + ' 0 R');
  }

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  function add(str) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += str + '\n';
  }

  // 1: Catalog
  add('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  // 2: Pages
  add('2 0 obj\n<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + numPages + ' >>\nendobj');

  // Pages & Contents
  for (let i = 0; i < numPages; i++) {
    const pageObjNum = 3 + i * 2;
    const contentObjNum = 4 + i * 2;
    const streamContent = pages[i];
    const streamLen = Buffer.byteLength(streamContent);

    add(`${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${f1Obj} 0 R /F2 ${f2Obj} 0 R /F3 ${f3Obj} 0 R >> >> >>\nendobj`);
    add(`${contentObjNum} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj`);
  }

  // Fonts
  add(`${f1Obj} 0 obj\n${fonts['/F1']}\nendobj`);
  add(`${f2Obj} 0 obj\n${fonts['/F2']}\nendobj`);
  add(`${f3Obj} 0 obj\n${fonts['/F3']}\nendobj`);

  const startxref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`;
  offsets.forEach(off => {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  });
  pdf += `trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  return pdf;
}

const materialsDir = path.join(__dirname, '..', 'uploads', 'materials');
const videosDir = path.join(__dirname, '..', 'uploads', 'videos');

if (!fs.existsSync(materialsDir)) fs.mkdirSync(materialsDir, { recursive: true });
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

// Copy sample video for all newly required video lessons
const sampleVideoPath = path.join(videosDir, 'sample-lesson.mp4');
const targetVideos = [
  'java-lesson.mp4',
  'mongodb-lesson.mp4',
  'datascience-lesson.mp4',
  'machinelearning-lesson.mp4',
  'software-engineering-lesson.mp4',
  'agile-lesson.mp4'
];

targetVideos.forEach(v => {
  const dest = path.join(videosDir, v);
  if (!fs.existsSync(dest) && fs.existsSync(sampleVideoPath)) {
    fs.copyFileSync(sampleVideoPath, dest);
    console.log(`[Video Prep] Created ${v}`);
  }
});

// Definitions for all 10 courses
const coursesHandbookData = [
  // 1. JavaScript Fundamentals
  {
    fileName: 'javascript_handbook.pdf',
    title: 'LearnSphere - JavaScript Fundamentals Handbook',
    subtitle: 'Course: JavaScript Fundamentals | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'JavaScript is the core programming language of the modern web platform. Originally designed as a lightweight client-side',
        'scripting language, modern ECMAScript (ES6+) powers robust full-stack web applications, asynchronous runtimes, and APIs.',
        '',
        '## 2. Important Concepts',
        '- Execution Context & Lexical Environment: Memory creation phase and code execution phase in the JavaScript engine.',
        '- Block Scope vs Function Scope: Differences between let/const (block-scoped) and legacy var (function-scoped).',
        '- Closures: Functions retaining references to variables in their lexical scope even after the outer function has completed.',
        '- Asynchronous JavaScript: Non-blocking I/O managed by the event loop, Call Stack, Microtask queue, and Macrotask queue.',
        '- Promises & Async/Await: Modern syntactic abstractions for managing asynchronous operations and avoiding callback hell.',
        '',
        '## 3. Detailed Explanations',
        'In JavaScript, variable declarations are processed during the engine compilation phase. let and const remain in the Temporal',
        'Dead Zone (TDZ) until evaluated. Closures empower private state encapsulation, functional currying, and memoization patterns.',
        'The Event Loop continuously inspects the call stack. When empty, it drains the Microtask queue (Promise callbacks) completely',
        'before dequeuing the next Macrotask (such as setTimeout or setInterval).',
        '',
        '## 4. Relevant Code Examples',
        '> function makeCounter(initial = 0) {',
        '>   let count = initial; // enclosed private variable',
        '>   return () => ++count;',
        '> }',
        '> const counter = makeCounter(10);',
        '> console.log(counter()); // Output: 11'
      ],
      [
        '## 5. Key Takeaways',
        '1. Default to const for immutable bindings; use let only when variable reassignment is required. Never use var in modern code.',
        '2. Closures allow functions to capture lexical scope state without global variable pollution.',
        '3. Microtasks (Promise.then, async/await continuations) always execute before the next tick of the Macrotask queue.',
        '4. Array methods like map(), filter(), and reduce() promote functional, declarative programming paradigms.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. What is the output of typeof null and why does this historical artifact exist?',
        'Q2. Explain the difference between synchronous execution and microtask queue scheduling.',
        'Q3. Write a JavaScript function that uses a closure to implement a private balance bank account module.',
        'Q4. How does the event loop prevent UI freezing during asynchronous network requests?',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 2. Web Development Basics
  {
    fileName: 'web_development_handbook.pdf',
    title: 'LearnSphere - Web Development Basics Handbook',
    subtitle: 'Course: Web Development Basics | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Web Development Basics establishes the essential building blocks of the World Wide Web: semantic HTML5 markup, responsive',
        'CSS3 styling models (Flexbox and Grid), client-server communication protocols, and modern browser document object models.',
        '',
        '## 2. Important Concepts',
        '- Semantic HTML5: Using header, nav, main, article, section, and footer elements for accessibility and document structure.',
        '- CSS Box Model: Understanding content, padding, border, and margin dimensions, plus box-sizing: border-box.',
        '- Modern CSS Layouts: Flexbox for one-dimensional alignment and CSS Grid for two-dimensional grid layouts.',
        '- Responsive Design: Media queries, mobile-first responsive design principles, and viewport scaling configuration.',
        '- HTTP Client-Server Model: Request methods (GET, POST, PUT, DELETE), status codes (200, 201, 400, 401, 403, 404, 500).',
        '',
        '## 3. Detailed Explanations',
        'Semantic HTML provides machine-readable meaning to web documents, enhancing screen reader accessibility and search engine',
        'indexing. The CSS Box Model governs spatial calculations: box-sizing: border-box ensures padding and borders are included within',
        'specified width and height attributes. Client-server communications operate over stateless HTTP/HTTPS protocols with JSON payloads.',
        '',
        '## 4. Relevant Code Examples',
        '> <div class="container" style="display: flex; justify-content: space-between; align-items: center;">',
        '>   <article class="card"><h3>Web Design</h3><p>Semantic layouts</p></article>',
        '> </div>'
      ],
      [
        '## 5. Key Takeaways',
        '1. Semantic markup is the foundation of accessible, search-engine-friendly web documents.',
        '2. Use Flexbox for linear navigational bars and toolbar rows; use CSS Grid for structural multi-column page layouts.',
        '3. Always adopt a mobile-first approach using responsive media queries (min-width breakpoints).',
        '4. HTTP status codes communicate client and server outcomes: 2xx success, 4xx client errors, 5xx server issues.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Describe the difference between block, inline, and inline-block display properties.',
        'Q2. How does the CSS box-sizing: border-box property simplify responsive layout calculations?',
        'Q3. What is the role of the viewport meta tag in mobile browser rendering?',
        'Q4. Write a simple CSS rule to center a card both horizontally and vertically using Flexbox.',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 3. Python Programming
  {
    fileName: 'python_handbook.pdf',
    title: 'LearnSphere - Python Programming Handbook',
    subtitle: 'Course: Python Programming | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Python is a high-level, interpreted programming language renowned for clear syntax, dynamic typing, and immense versatility.',
        'It is universally adopted in web backends, automation scripts, data analysis, scientific computation, and machine learning.',
        '',
        '## 2. Important Concepts',
        '- Dynamic Typing & Memory Management: Everything in Python is an object; memory is managed via reference counting & garbage collection.',
        '- Data Structures: Mutable lists and dictionaries; immutable tuples and unique sets.',
        '- List Comprehensions: Expressive and high-performance inline list transformation syntax.',
        '- Object-Oriented Programming: Classes, constructors (__init__), instance methods, inheritance, and encapsulation.',
        '- Exception Handling: Robust error containment using try, except, else, and finally blocks.',
        '',
        '## 3. Detailed Explanations',
        'Python features an intuitive indentation-based syntax. Variable bindings reference heap-allocated objects. List comprehensions',
        'provide syntactic clarity and bytecode performance gains compared to manual for-loop iteration. Python supports multiple',
        'programming paradigms including object-oriented, procedural, and functional programming constructs.',
        '',
        '## 4. Relevant Code Examples',
        '> class Student:',
        '>     def __init__(self, name, score):',
        '>         self.name = name',
        '>         self.score = score',
        '>     def is_passing(self, threshold=60):',
        '>         return self.score >= threshold',
        '> students = [Student("Alex", 85), Student("Priya", 92)]',
        '> passing = [s.name for s in students if s.is_passing()]'
      ],
      [
        '## 5. Key Takeaways',
        '1. Write Pythonic code by adhering to PEP 8 style guides and using idiomatic comprehensions.',
        '2. Choose appropriate data structures: dictionaries for O(1) key lookups, tuples for immutable record integrity.',
        '3. Encapsulate business logic into modular functions and object-oriented class hierarchies.',
        '4. Always manage external resources (like files or database connections) using context managers (with statements).',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Explain the operational difference between deepcopy() and shallow copy in Python.',
        'Q2. How do Python generators and the yield keyword conserve memory when processing large datasets?',
        'Q3. Write a Python function that accepts a list of integers and returns a dictionary counting the frequency of each item.',
        'Q4. What is the difference between *args and **kwargs in Python function definitions?',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 4. Java Programming
  {
    fileName: 'java_handbook.pdf',
    title: 'LearnSphere - Java Programming Handbook',
    subtitle: 'Course: Java Programming | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Java is an enterprise-grade, strongly typed, class-based object-oriented programming language designed for platform independence.',
        'Following the "Write Once, Run Anywhere" (WORA) philosophy, Java applications compile into bytecode executed on the JVM.',
        '',
        '## 2. Important Concepts',
        '- Java Virtual Machine (JVM): Architecture, Bytecode compilation, ClassLoader, and Just-In-Time (JIT) compiler.',
        '- OOP Four Pillars: Encapsulation (access modifiers), Inheritance (extends), Polymorphism (overriding), and Abstraction.',
        '- Interfaces vs Abstract Classes: Contractual API design with interface default methods versus base class inheritance.',
        '- Java Collections Framework: List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Map (HashMap, TreeMap).',
        '- Exception Hierarchy: Checked exceptions (subclasses of Exception) versus unchecked runtime exceptions.',
        '',
        '## 3. Detailed Explanations',
        'Java enforces compile-time type safety. The JVM manages heap memory automatically using generational garbage collection.',
        'Polymorphism is achieved through dynamic method dispatch at runtime. The Collections framework provides standardized data',
        'structures engineered for computational efficiency and thread safety.',
        '',
        '## 4. Relevant Code Examples',
        '> public interface Gradeable {',
        '>     double calculatePercentage(double maxMarks);',
        '> }',
        '> public class Submission implements Gradeable {',
        '>     private double earnedMarks;',
        '>     public Submission(double earnedMarks) { this.earnedMarks = earnedMarks; }',
        '>     @Override',
        '>     public double calculatePercentage(double maxMarks) { return (earnedMarks / maxMarks) * 100.0; }',
        '> }'
      ],
      [
        '## 5. Key Takeaways',
        '1. Java guarantees robust memory safety and cross-platform compatibility through bytecode compilation.',
        '2. Use interfaces to define capability contracts and decouple dependencies; prefer composition over deep inheritance.',
        '3. Leverage generics in the Collections Framework to prevent runtime ClassCastExceptions.',
        '4. Implement try-with-resources (AutoCloseable) to eliminate resource leakage for streams, sockets, and connections.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. What is the distinction between final, finally, and finalize in Java?',
        'Q2. Explain the difference between HashMap and ConcurrentHashMap in multi-threaded enterprise systems.',
        'Q3. What are Java Generics and how does type erasure operate at compilation time?',
        'Q4. Write a Java class demonstrating method overriding and the super keyword.',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 5. Database Management Systems
  {
    fileName: 'sql_reference_guide.pdf',
    title: 'LearnSphere - Database Management Systems Handbook',
    subtitle: 'Course: Database Management Systems | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Database Management Systems (DBMS) are the technological backbone of modern data persistence. Relational databases structure',
        'information into normalized tables, enforcing referential integrity and supporting complex declarative SQL queries.',
        '',
        '## 2. Important Concepts',
        '- Relational Model & Keys: Entity-Relationship models, primary keys, foreign keys, candidate keys, and surrogate keys.',
        '- Relational Algebra: Core relational operations including selection, projection, cartesian product, and natural joins.',
        '- SQL DDL & DML: Schema definitions (CREATE, ALTER, DROP) and data manipulation statements (SELECT, INSERT, UPDATE, DELETE).',
        '- Database Normalization: Progressing from 1NF (atomic values) to 2NF (no partial dependencies) to 3NF and BCNF.',
        '- ACID Properties: Atomicity, Consistency, Isolation, and Durability in transaction processing.',
        '',
        '## 3. Detailed Explanations',
        'Normalization systematically removes insertion, update, and deletion anomalies by analyzing functional dependencies. ACID',
        'guarantees ensure that concurrent database transactions execute reliably without data corruption. B-Tree and hash indexing',
        'drastically accelerate query performance by reducing disk block I/O operations from O(N) full scans to O(log N) lookups.',
        '',
        '## 4. Relevant Code Examples',
        '> SELECT c.title, COUNT(e.id) AS student_count',
        '> FROM courses c',
        '> LEFT JOIN enrollments e ON c.id = e.course_id',
        '> GROUP BY c.id, c.title',
        '> HAVING COUNT(e.id) >= 5',
        '> ORDER BY student_count DESC;'
      ],
      [
        '## 5. Key Takeaways',
        '1. Relational schema design relies on mathematical functional dependencies to prevent data redundancy.',
        '2. Primary keys enforce entity uniqueness; foreign keys guarantee referential integrity across parent-child tables.',
        '3. ACID properties are essential for mission-critical banking, transactional, and educational records.',
        '4. Indexes improve read query throughput but introduce overhead during write (INSERT/UPDATE/DELETE) operations.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Deconstruct a sample unnormalized order invoice table into 1NF, 2NF, and 3NF.',
        'Q2. Contrast the four ANSI SQL transaction isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
        'Q3. What is the operational difference between an INNER JOIN and a FULL OUTER JOIN in SQL?',
        'Q4. Write a SQL query using subqueries or window functions to find the second highest assignment score.',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 6. MongoDB Fundamentals
  {
    fileName: 'mongodb_handbook.pdf',
    title: 'LearnSphere - MongoDB Fundamentals Handbook',
    subtitle: 'Course: MongoDB Fundamentals | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'MongoDB is the leading NoSQL document-oriented database system designed for agility, horizontal scalability, and developer',
        'productivity. It stores semi-structured data in BSON format, offering flexible schemas and powerful expressive query capabilities.',
        '',
        '## 2. Important Concepts',
        '- Document Data Model: JSON/BSON records containing polymorphic key-value pairs, nested subdocuments, and arrays.',
        '- Data Modeling Strategies: Embedding documents (one-to-few) versus referencing ObjectIds (one-to-many/many-to-many).',
        '- CRUD Operations: createIndex, find, insertOne, updateMany, and deleteOne commands with atomic update operators ($set, $push).',
        '- Aggregation Framework: Pipeline stages including $match, $group, $lookup (left joins), $project, $sort, and $unwind.',
        '- Indexing & Sharding: Single field, compound, text, and TTL indexes; horizontal scaling via sharded cluster partitions.',
        '',
        '## 3. Detailed Explanations',
        'Unlike rigid relational tabular models, MongoDB allows each document in a collection to maintain dynamic fields. BSON provides',
        'efficient binary representation supporting rich data types like Date, ObjectId, and 64-bit integers. The Aggregation Pipeline',
        'processes document streams sequentially, providing map-reduce capabilities with compiled C++ database engine performance.',
        '',
        '## 4. Relevant Code Examples',
        '> db.enrollments.aggregate([',
        '>   { $match: { progress: { $gt: 50 } } },',
        '>   { $group: { _id: "$courseId", activeStudents: { $sum: 1 } } },',
        '>   { $sort: { activeStudents: -1 } }',
        '> ]);'
      ],
      [
        '## 5. Key Takeaways',
        '1. Model data according to application access patterns: data accessed together should generally be stored together.',
        '2. Use embedding for bounded subdocuments (e.g. quiz question options); use referencing for unbounded growing relationships.',
        '3. Compound index key order matters: follow the Equality, Sort, Range (ESR) guideline for optimal index utilization.',
        '4. The Aggregation Pipeline provides powerful multi-stage data transformation without client-side computational overhead.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Contrast the advantages and drawbacks of document embedding versus document referencing in MongoDB.',
        'Q2. How does the $lookup aggregation stage mimic an SQL left outer join across disparate collections?',
        'Q3. Write a MongoDB update command using arrayFilters to modify a specific element within a nested array.',
        'Q4. What is the role of the WiredTiger storage engine in document-level concurrency and compression?',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 7. Introduction to Data Science
  {
    fileName: 'datascience_handbook.pdf',
    title: 'LearnSphere - Introduction to Data Science Handbook',
    subtitle: 'Course: Introduction to Data Science | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Data Science is an interdisciplinary field combining statistics, computational mathematics, and domain expertise to extract',
        'actionable insights and empirical patterns from structured, semi-structured, and unstructured data streams.',
        '',
        '## 2. Important Concepts',
        '- The Data Science Lifecycle: Problem formulation, data acquisition, cleaning/wrangling, EDA, modeling, and communication.',
        '- Data Wrangling with Pandas: Handling null values, reshaping DataFrames, type casting, merging, and grouping.',
        '- Exploratory Data Analysis (EDA): Summary statistics, identifying distributions, skewness, outliers, and correlations.',
        '- Statistical Foundations: Mean, median, variance, standard deviation, hypothesis testing (p-values), and confidence intervals.',
        '- Visual Communication: Designing charts with Matplotlib & Seaborn to convey empirical conclusions accurately.',
        '',
        '## 3. Detailed Explanations',
        'Real-world raw data is inherently noisy and incomplete. Data cleaning and imputation often occupy 70-80% of project time.',
        'EDA utilizes visual diagnostics (histograms, box plots, scatter matrices) to identify latent patterns and multicollinearity',
        'before selecting statistical or predictive models. Parametric tests require normality, whereas non-parametric tests offer robustness.',
        '',
        '## 4. Relevant Code Examples',
        '> import pandas as pd',
        '> df = pd.read_csv("student_evaluations.csv")',
        '> cleaned = df.dropna(subset=["score"])',
        '> summary = cleaned.groupby("course_category")["score"].agg(["mean", "std", "count"])'
      ],
      [
        '## 5. Key Takeaways',
        '1. Rigorous data validation and cleaning are prerequisites for valid downstream statistical inferences.',
        '2. Correlation does not imply causation; always inspect data context and confounders.',
        '3. Choose the median over the mean when dealing with skewed data containing significant outliers.',
        '4. Visualizations must maintain honest scales and clear labels to communicate findings without distortion.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. What is the difference between missing completely at random (MCAR) and missing at random (MAR)?',
        'Q2. Explain the Central Limit Theorem and its practical relevance to statistical sampling.',
        'Q3. How do you identify outliers using the Interquartile Range (IQR) method?',
        'Q4. Write a Pandas snippet to pivot a table and compute category-wise metrics.',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 8. Machine Learning Basics
  {
    fileName: 'machinelearning_handbook.pdf',
    title: 'LearnSphere - Machine Learning Basics Handbook',
    subtitle: 'Course: Machine Learning Basics | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Machine Learning enables computer systems to learn patterns and decision boundaries directly from empirical data without',
        'being explicitly programmed. It spans supervised learning (labeled targets), unsupervised clustering, and reinforcement agents.',
        '',
        '## 2. Important Concepts',
        '- Supervised vs Unsupervised Learning: Regression and classification versus clustering (K-Means) and dimensionality reduction (PCA).',
        '- Linear Regression & Cost Functions: Ordinary Least Squares, Mean Squared Error (MSE), and Gradient Descent optimization.',
        '- Logistic Regression: Sigmoid activation function mapping linear combinations into probabilistic [0, 1] classifications.',
        '- Bias-Variance Tradeoff: Underfitting (high bias, low variance) versus overfitting (low bias, high variance).',
        '- Model Evaluation Metrics: Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix, and K-Fold Cross-Validation.',
        '',
        '## 3. Detailed Explanations',
        'Supervised models map feature vector X to continuous target Y (regression) or categorical class C (classification). Optimization',
        'algorithms like Gradient Descent iteratively update model weights by computing loss function gradients. Regularization techniques',
        '(L1 Lasso, L2 Ridge) penalize excessive parameter magnitudes, preventing overfitting on training datasets.',
        '',
        '## 4. Relevant Code Examples',
        '> from sklearn.model_selection import train_test_split',
        '> from sklearn.linear_model import LogisticRegression',
        '> from sklearn.metrics import classification_report',
        '> X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)',
        '> model = LogisticRegression().fit(X_train, y_train)',
        '> print(classification_report(y_test, model.predict(X_test)))'
      ],
      [
        '## 5. Key Takeaways',
        '1. Always split datasets into train, validation, and test subsets to guarantee generalizability on unseen data.',
        '2. In imbalanced datasets (e.g. rare fraud or medical diagnoses), precision, recall, and F1-Score supersede raw accuracy.',
        '3. Feature scaling (StandardScaler or MinMaxScaler) is essential for distance-based and gradient-descent algorithms.',
        '4. Combat overfitting through cross-validation, regularization, and gathering more representative training samples.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Explain the components of a Confusion Matrix: True Positive, False Positive, True Negative, False Negative.',
        'Q2. What is the fundamental difference between L1 (Lasso) and L2 (Ridge) regularization?',
        'Q3. Why is Gradient Descent learning rate selection critical to model convergence?',
        'Q4. How does K-Fold Cross-Validation provide a more reliable estimate of model performance than a single train/test split?',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 9. Software Engineering Fundamentals
  {
    fileName: 'software_engineering_handbook.pdf',
    title: 'LearnSphere - Software Engineering Fundamentals Handbook',
    subtitle: 'Course: Software Engineering Fundamentals | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Software Engineering is the systematic application of engineering principles, disciplined methodologies, and quantifiable techniques',
        'to the development, operation, maintenance, and quality assurance of complex software systems.',
        '',
        '## 2. Important Concepts',
        '- Software Development Life Cycle (SDLC): Feasibility, requirements, architectural design, coding, testing, and deployment.',
        '- Requirement Engineering: Elicitation, analysis, specification (SRS documents), verification, and functional vs non-functional requirements.',
        '- Architectural Design Principles: Modularity, High Cohesion, Low Coupling, Separation of Concerns, and SOLID design patterns.',
        '- Software Testing Methodologies: Unit testing, integration testing, system testing, regression testing, and black-box/white-box methods.',
        '- Software Maintenance: Corrective bug fixing, adaptive environmental updates, perfective performance enhancements, and preventive refactoring.',
        '',
        '## 3. Detailed Explanations',
        'Rigorous software engineering prevents architectural debt and project failure. High cohesion ensures that classes or modules',
        'focus on a single well-defined responsibility; low coupling minimizes inter-module dependencies, making software adaptable to change.',
        'Testing establishes verifiable quality assurance through automated unit tests, continuous integration, and regression suites.',
        '',
        '## 4. Relevant Architecture Example',
        '> // SOLID: Single Responsibility Principle (SRP)',
        '> class UserAuthenticator { public Token authenticate(User user) { ... } }',
        '> class PasswordHasher { public String hash(String rawPassword) { ... } }',
        '> class AuditLogger { public void logLoginEvent(String userId) { ... } }'
      ],
      [
        '## 5. Key Takeaways',
        '1. Clear, unambiguous requirements gathered in an SRS document prevent expensive downstream rework.',
        '2. Architectural modularity (high cohesion and loose coupling) is the hallmark of maintainable enterprise software.',
        '3. Automated testing must accompany every layer of development: unit tests for logic, integration tests for APIs.',
        '4. Refactoring continuously improves internal code structure without changing external system behavior.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. Differentiate between functional requirements and non-functional requirements with examples from an LMS platform.',
        'Q2. Explain each of the five SOLID design principles and why they promote extensible software architecture.',
        'Q3. What is the difference between verification ("Are we building the product right?") and validation ("Are we building the right product?")?',
        'Q4. How does technical debt accumulate, and what engineering practices mitigate it?',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  },

  // 10. Agile Software Development
  {
    fileName: 'agile_software_development_handbook.pdf',
    title: 'LearnSphere - Agile Software Development Handbook',
    subtitle: 'Course: Agile Software Development | Instructor: Dr. Sarah Jenkins',
    pages: [
      [
        '## 1. Topic Introduction',
        'Agile Software Development is an iterative and collaborative approach to project management and software delivery. Codified in',
        'the 2001 Agile Manifesto, it prioritizes working software, customer collaboration, and rapid responsiveness to requirement changes.',
        '',
        '## 2. Important Concepts',
        '- Four Agile Manifesto Values: Individuals & interactions over processes; working software over comprehensive documentation;',
        '  customer collaboration over contract negotiation; responding to change over following a plan.',
        '- The Scrum Framework: Roles (Product Owner, Scrum Master, Developers), Artifacts (Product Backlog, Sprint Backlog, Increment),',
        '  and Ceremonies (Sprint Planning, Daily Standup, Sprint Review, Sprint Retrospective).',
        '- User Stories & Sizing: Formatted as "As a <role>, I want <goal>, so that <benefit>" estimated in relative Story Points (Fibonacci).',
        '- Managing Requirement Changes: Formal change requests (CRs), scope trade-offs, and backlog reprioritization.',
        '- Agile Metrics: Team velocity, burndown charts, cycle time, and Definition of Done (DoD).',
        '',
        '## 3. Detailed Explanations',
        'In traditional Waterfall models, changing requirements mid-project incurs heavy financial and timeline penalties. Agile embraces',
        'change through small 2-week iterations. When stakeholders introduce a new priority (such as a Discussion Forum), the Product Owner',
        'evaluates effort and adjusts the backlog—deferring lower-priority scope to protect deadlines without burning out developers.',
        '',
        '## 4. Relevant Agile Artifact Example',
        '> USER STORY US-09: Course Discussion Forum (5 Story Points | Priority: HIGH)',
        '> Acceptance Criteria: Given an enrolled student, when they post a question,',
        '> then the thread is saved in MongoDB and displayed with author details.'
      ],
      [
        '## 5. Key Takeaways',
        '1. Agile delivers value incrementally through functional, tested software increments at the end of every sprint.',
        '2. Embracing change requires disciplined trade-offs: swap scope in and out rather than extending fixed delivery dates.',
        '3. Story points measure relative effort, complexity, and uncertainty rather than rigid hours.',
        '4. Retrospectives facilitate continuous team improvement by inspecting process friction and executing action items.',
        '',
        '## 6. Practice Questions & Exercises',
        'Q1. How does the Agile Iron Triangle (Scope, Cost, Time) differ from the traditional Waterfall triangle?',
        'Q2. Explain the responsibilities of the Product Owner, Scrum Master, and Development Team during Sprint Planning.',
        'Q3. What is the Definition of Done (DoD) and why is it critical for increment quality assurance?',
        'Q4. Outline the exact steps an Agile team follows when a high-priority requirement change is introduced after Sprint 1.',
        '',
        'Academic Verification Notice: LearnSphere Full-Stack Online Learning Platform - Agile Evaluation 2026.'
      ]
    ]
  }
];

// Generate all 10 PDFs
coursesHandbookData.forEach(item => {
  const filePath = path.join(materialsDir, item.fileName);
  const pdfBytes = createCoursePdf(item.title, item.subtitle, item.pages);
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`[PDF Generated] ${item.fileName} (${Buffer.byteLength(pdfBytes)} bytes)`);
});

console.log('[Complete] All 10 Course PDF study materials and sample videos generated successfully!');
