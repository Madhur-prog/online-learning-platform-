# LearnSphere - Defect Identification & Correction Report

## 1. Defect Metadata
- **Defect ID:** BUG-001
- **Severity:** High
- **Priority:** High
- **Module:** Quiz Assessment Engine (`backend/services/quizScorer.js`)
- **Found In Sprint:** Sprint 2 Quality Audit
- **Status:** **Resolved & Verified with Automated Regression Test**

---

## 2. Defect Description & Problem Statement
The original scoring algorithm contained a mathematical flaw: it calculated student percentage scores by dividing the **number of correct questions** by the **total number of questions**, thereby falsely assuming that all questions carried identical weight (1 mark each).

In real-world educational exams and LMS platforms, instructors frequently assign varying weights to questions based on difficulty (e.g., easy questions carry 2 marks, moderate questions carry 3 marks, and complex problem-solving questions carry 5 marks).

### Concrete Demonstration Example
Consider a 3-question quiz:
- **Question 1:** 2 Marks
- **Question 2:** 3 Marks
- **Question 3:** 5 Marks
- **Total Possible Marks:** $2 + 3 + 5 = 10\text{ Marks}$

Suppose a student correctly answers **Question 1** (2 marks) and **Question 3** (5 marks), but misses **Question 2**:
- **Actual Marks Earned:** $2 + 5 = 7\text{ Marks}$
- **True Percentage:** $\frac{7}{10} \times 100 = \mathbf{70.00\%}$ (Pass)

### The Buggy Calculation (Root Cause)
The flawed logic executed:
$$\text{Percentage} = \frac{\text{Correct Questions Count}}{\text{Total Questions Count}} \times 100 = \frac{2}{3} \times 100 = \mathbf{66.67\%}$$

This resulted in:
1. An artificial 3.33% grade penalty for the student.
2. In marginal cases (such as a 70% passing threshold), the student would be erroneously marked as **Failed** despite earning the requisite weighted points.

---

## 3. Educational Fixture vs Corrected Implementation

To facilitate academic evaluation without compromising production code quality, the historical buggy implementation is preserved in an isolated educational fixture at `backend/tests/fixtures/buggyQuizScorer.js`.

### Historical Buggy Code (`backend/tests/fixtures/buggyQuizScorer.js`)
```javascript
// BUG: Treats questions equally regardless of their individual marks
const totalQuestions = quiz.questions.length;
let correctCount = 0;
// ...
const percentage = Math.round((correctCount / totalQuestions) * 100 * 100) / 100;
```

### Corrected Production Implementation (`backend/services/quizScorer.js`)
```javascript
let totalMarks = 0;
let score = 0;

quiz.questions.forEach((question, index) => {
  const questionMarks = Number(question.marks) || 1;
  totalMarks += questionMarks;

  const studentAns = submittedAnswers.find(a => a.questionIndex === index);
  const selectedOptionIndex = studentAns ? Number(studentAns.selectedOptionIndex) : -1;

  const isCorrect = selectedOptionIndex === question.correctOptionIndex;
  const marksEarned = isCorrect ? questionMarks : 0;
  score += marksEarned;
});

// Correct: Ratio of total earned marks to total possible marks
const percentage = totalMarks > 0
  ? Math.round((score / totalMarks) * 100 * 100) / 100
  : 0;

const passed = percentage >= (quiz.passingPercentage || 60);
```

---

## 4. Automated Regression Test Proof

The regression test is formally embedded in `backend/tests/learnsphere.test.js`:

```javascript
test('BUG-001 Regression Test: Weighted Quiz Score vs Buggy Equal-Weight Score', () => {
  const sampleQuiz = {
    title: 'Weighted Evaluation Demo',
    passingPercentage: 60,
    questions: [
      { questionText: 'Q1', correctOptionIndex: 0, marks: 2 },
      { questionText: 'Q2', correctOptionIndex: 1, marks: 3 },
      { questionText: 'Q3', correctOptionIndex: 2, marks: 5 }
    ]
  };

  const submittedAnswers = [
    { questionIndex: 0, selectedOptionIndex: 0 }, // Correct (2 marks)
    { questionIndex: 1, selectedOptionIndex: 0 }, // Incorrect (0 marks)
    { questionIndex: 2, selectedOptionIndex: 2 }  // Correct (5 marks)
  ];

  // 1. Buggy calculation reproduces the defect:
  const buggyResult = calculateBuggyQuizScore(sampleQuiz, submittedAnswers);
  expect(buggyResult.percentage).toBe(66.67); // FAILS expected weighted value!

  // 2. Corrected active implementation calculates accurate 70%:
  const correctedResult = calculateQuizScore(sampleQuiz, submittedAnswers);
  expect(correctedResult.score).toBe(7);
  expect(correctedResult.totalMarks).toBe(10);
  expect(correctedResult.percentage).toBe(70); // PASSES!
  expect(correctedResult.passed).toBe(true);
});
```

---

## 5. Verification Evidence
During test suite execution:
```text
PASS tests/learnsphere.test.js
  LearnSphere Full-Stack API Test Suite (TC01 - TC12 & BUG-001)
    Quiz Module & BUG-001 Defect Correction
      √ BUG-001 Regression Test: Weighted Quiz Score vs Buggy Equal-Weight Score (3 ms)
```

The bug is fully corrected, validated, and prevented from recurring in future releases.
