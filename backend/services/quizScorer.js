/**
 * Quiz Score Calculation Service
 * 
 * Corrected Implementation (Fix for BUG-001):
 * Calculates student score based on question weights (marks assigned per question).
 * Percentage = (Total Earned Marks / Total Possible Marks) * 100
 */

function calculateQuizScore(quiz, submittedAnswers) {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    throw new Error('Invalid quiz structure');
  }

  if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
    throw new Error('Submitted answers must be a non-empty array');
  }

  let totalMarks = 0;
  let score = 0;
  const detailedAnswers = [];

  quiz.questions.forEach((question, index) => {
    const questionMarks = Number(question.marks) || 1;
    totalMarks += questionMarks;

    // Find student answer for this question
    const studentAns = submittedAnswers.find(a => a.questionIndex === index);
    const selectedOptionIndex = studentAns !== undefined && studentAns.selectedOptionIndex !== undefined
      ? Number(studentAns.selectedOptionIndex)
      : -1;

    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    const marksEarned = isCorrect ? questionMarks : 0;
    score += marksEarned;

    detailedAnswers.push({
      questionIndex: index,
      selectedOptionIndex,
      isCorrect,
      marksEarned
    });
  });

  const percentage = totalMarks > 0
    ? Math.round((score / totalMarks) * 100 * 100) / 100
    : 0;

  const passed = percentage >= (quiz.passingPercentage || 60);

  return {
    score,
    totalMarks,
    percentage,
    passed,
    answers: detailedAnswers
  };
}

module.exports = {
  calculateQuizScore
};
