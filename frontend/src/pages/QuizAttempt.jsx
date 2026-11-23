import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../services/quizService';
import { Award, CheckCircle, Clock, AlertCircle, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pastAttempt, setPastAttempt] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(id);
        if (data.success) {
          if (data.hasAttempted && data.attempt) {
            setPastAttempt(data.attempt);
          }
          setQuiz(data.quiz);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const questions = quiz.questions || [];
    const answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < questions.length) {
      if (!window.confirm(`You have only answered ${answeredCount} of ${questions.length} questions. Do you want to submit anyway?`)) {
        return;
      }
    }

    // Format answers array: [{ questionIndex, selectedOptionIndex }]
    const formattedAnswers = questions.map((_, index) => ({
      questionIndex: index,
      selectedOptionIndex: selectedAnswers[index] !== undefined ? selectedAnswers[index] : -1
    }));

    setSubmitting(true);
    try {
      const res = await submitQuiz(id, formattedAnswers);
      if (res.success) {
        navigate(`/quizzes/results/${res.attemptId}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing quiz questions..." />;
  }

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Quiz not found'} />
        <Link to="/courses" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Courses
        </Link>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Quiz Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                Assessment
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Passing: {quiz.passingPercentage}%
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {quiz.title}
            </h1>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 font-semibold block">Questions Answered</span>
            <span className="text-lg font-black text-blue-600">
              {answeredCount} / {questions.length}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {quiz.description || 'Answer the questions below to evaluate your conceptual understanding. Note: individual questions may carry different marks.'}
        </p>

        {pastAttempt && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-blue-900">
              You previously completed this quiz on {new Date(pastAttempt.submittedAt).toLocaleDateString()} with a score of <strong>{pastAttempt.score}/{pastAttempt.totalMarks} ({pastAttempt.percentage}%)</strong>. You may retake it below or view your previous evaluation.
            </div>
            <Link
              to={`/quizzes/results/${pastAttempt._id}`}
              className="shrink-0 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
            >
              View Previous Result
            </Link>
          </div>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[qIndex];
          return (
            <div
              key={q._id || qIndex}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <span>{q.questionText}</span>
                </h3>
                <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {q.marks || 1} {q.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2 pl-10">
                {q.options.map((option, optIndex) => {
                  const isChecked = selectedOption === optIndex;
                  return (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={isChecked}
                        onChange={() => handleSelectOption(qIndex, optIndex)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-xs text-slate-500">
            {answeredCount === questions.length ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                All questions answered. Ready to submit!
              </span>
            ) : (
              <span>You have answered {answeredCount} out of {questions.length} questions.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
          >
            {submitting ? 'Calculating Score...' : 'Submit Quiz Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizAttempt;
