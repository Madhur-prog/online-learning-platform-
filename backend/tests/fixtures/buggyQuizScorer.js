/**
 * HISTORICAL BUGGY IMPLEMENTATION FIXTURE (BUG-001)
 * 
 * For Academic External Jury Evaluation Demonstration ONLY.
 * 
 * Root Cause:
 * This buggy version incorrectly calculated percentage by treating all questions as
 * having equal weight (correct questions count / total questions count * 100),
 * ignoring individual question marks.
 * 
 * Example:
 * Q1 = 2 marks, Q2 = 3 marks, Q3 = 5 marks (Total = 10 marks).
 * Student gets Q1 and Q3 correct (Earned 7/10 = 70%).
 * Buggy Calculation: 2/3 * 100 = 66.67% (Wrong!)
 */

function calculateBuggyQuizScore(quiz, submittedAnswers) {
  const totalQuestions = quiz.questions.length;
  let correctCount = 0;
  let score = 0;
  let totalMarks = 0;

  quiz.questions.forEach((question, index) => {
    const questionMarks = Number(question.marks) || 1;
    totalMarks += questionMarks;

    const studentAns = submittedAnswers.find(a => a.questionIndex === index);
    const selected = studentAns ? studentAns.selectedOptionIndex : -1;

    if (selected === question.correctOptionIndex) {
      correctCount += 1;
      score += questionMarks;
    }
  });

  // BUG: Treating questions equally instead of using total marks ratio
  const percentage = Math.round((correctCount / totalQuestions) * 100 * 100) / 100;
  const passed = percentage >= (quiz.passingPercentage || 60);

  return {
    score,
    totalMarks,
    percentage,
    passed
  };
}

module.exports = {
  calculateBuggyQuizScore
};
