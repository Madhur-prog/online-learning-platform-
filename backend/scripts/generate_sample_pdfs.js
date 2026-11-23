const fs = require('fs');
const path = require('path');

function createMinimalPdf(title, lines) {
  let streamText = 'BT\n/F1 18 Tf\n50 720 Td\n(' + title + ') Tj\n/F1 11 Tf\n0 -30 Td\n';
  lines.forEach(line => {
    const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamText += '(' + escaped + ') Tj\n0 -18 Td\n';
  });
  streamText += 'ET';

  const len = Buffer.byteLength(streamText);
  let pdf = '%PDF-1.4\n';
  const offsets = [];

  function addObj(content) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += content + '\n';
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj');
  addObj('4 0 obj\n<< /Length ' + len + ' >>\nstream\n' + streamText + '\nendstream\nendobj');
  addObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');

  const startxref = Buffer.byteLength(pdf);
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  offsets.forEach(off => {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  });
  pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';
  return pdf;
}

const materialsDir = path.join(__dirname, '..', 'uploads', 'materials');
const assignmentsDir = path.join(__dirname, '..', 'uploads', 'assignments');

if (!fs.existsSync(materialsDir)) fs.mkdirSync(materialsDir, { recursive: true });
if (!fs.existsSync(assignmentsDir)) fs.mkdirSync(assignmentsDir, { recursive: true });

const jsPdf = createMinimalPdf('LearnSphere - JavaScript Fundamentals Handbook', [
  'Course: JavaScript Fundamentals',
  'Instructor: Dr. Sarah Jenkins',
  '',
  'Key Concepts Summary:',
  '1. Lexical Scoping & Block Scope: let and const introduce block scope.',
  '2. Closures: Inner functions retain access to their lexical environment.',
  '3. Asynchronous JavaScript: Event loop coordinates Microtasks and Macrotasks.',
  '4. Promises & Async/Await: Clean syntax for asynchronous execution.',
  '',
  'Academic Verification: LearnSphere Online Learning Platform.'
]);
fs.writeFileSync(path.join(materialsDir, 'javascript_handbook.pdf'), jsPdf);

const sqlPdf = createMinimalPdf('LearnSphere - SQL & Normalization Reference Guide', [
  'Course: Database Management Systems',
  'Instructor: Dr. Sarah Jenkins',
  '',
  'Key Concepts Summary:',
  '1. Normalization: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies).',
  '2. Relational Algebra: Selection, Projection, Cartesian Product, Join.',
  '3. SQL Joins: INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN.',
  '4. ACID Properties: Atomicity, Consistency, Isolation, Durability.',
  '',
  'Academic Verification: LearnSphere Online Learning Platform.'
]);
fs.writeFileSync(path.join(materialsDir, 'sql_reference_guide.pdf'), sqlPdf);

const subPdf = createMinimalPdf('Student Submission - DOM Todo Application', [
  'Student: Alex Chen (student@learnsphere.com)',
  'Course: JavaScript Fundamentals',
  'Assignment: Build an Interactive DOM Todo Application',
  '',
  'Executive Summary:',
  '- Implemented complete interactive task list with add, remove, and toggle operations.',
  '- Utilized event delegation on the task container to ensure optimal performance.',
  '- State is serialized into localStorage for offline persistence.',
  '- Clean ES6 classes and modular function architecture.'
]);
fs.writeFileSync(path.join(assignmentsDir, 'student_todo_submission.pdf'), subPdf);

console.log('PDFs successfully generated with valid PDF-1.4 structures!');
