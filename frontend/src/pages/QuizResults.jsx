import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuizResult } from '../services/quizService';
import { Award, CheckCircle2, XCircle, ArrowLeft, HelpCircle, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const QuizResults = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getQuizResult(attemptId);
        if (data.success) {
          setAttempt(data.attempt);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return <LoadingSpinner text="Loading quiz results & scoring breakdown..." />;
  }

  if (error || !attempt) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Attempt record not found'} />
        <Link to="/courses" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Courses
        </Link>
      </div>
    );
  }

  const quiz = attempt.quizId || {};
  const questions = quiz.questions || [];
  const correctCount = attempt.answers?.filter(a => a.isCorrect).length || 0;
  const isPassed = attempt.passed;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={`/courses/${attempt.courseId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Overview
        </Link>
      </div>

      {/* Main Scorecard Banner */}
      <div className={`rounded-2xl border p-8 shadow-xs ${
        isPassed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white shadow-xs">
              {isPassed ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Quiz Passed
                </span>
              ) : (
                <span className="text-rose-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Quiz Not Passed
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {quiz.title || 'Quiz Assessment Results'}
            </h1>
            <p className="text-xs text-slate-600">
              Submitted on {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>

          {/* Score Circular / Large Stat Badge */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center shrink-0 min-w-44">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Score</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {attempt.score} <span className="text-lg font-bold text-slate-400">/ {attempt.totalMarks}</span>
            </div>
            <div className={`text-sm font-extrabold mt-1 ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {attempt.percentage}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Passing Mark: {quiz.passingPercentage}%
            </span>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-bold uppercase text-slate-500">Total Questions</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{questions.length}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-bold uppercase text-slate-500">Correct Answers</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{correctCount}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-bold uppercase text-slate-500">Total Marks</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{attempt.totalMarks}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-bold uppercase text-slate-500">Result</span>
            <p className={`text-lg font-black mt-0.5 ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPassed ? 'Passed' : 'Failed'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Question Breakdown & Review
        </h2>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const studentAns = attempt.answers?.find(a => a.questionIndex === idx);
            const selectedOpt = studentAns ? studentAns.selectedOptionIndex : -1;
            const isCorrect = studentAns ? studentAns.isCorrect : false;
            const marksEarned = studentAns ? studentAns.marksEarned : 0;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {q.questionText}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {marksEarned} / {q.marks || 1} Marks
                    </span>
                  </div>
                </div>

                {/* Options Review */}
                <div className="space-y-2 pl-10 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isStudentChoice = selectedOpt === optIdx;
                    const isActualCorrect = q.correctOptionIndex === optIdx;

                    let optionStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isActualCorrect) {
                      optionStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    } else if (isStudentChoice && !isActualCorrect) {
                      optionStyle = 'border-rose-300 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-500';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between ${optionStyle}`}
                      >
                        <span className="flex-1">{opt}</span>
                        {isStudentChoice && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 ml-2">
                            Your Answer
                          </span>
                        )}
                        {isActualCorrect && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white ml-2">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="ml-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">Explanation:</span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
