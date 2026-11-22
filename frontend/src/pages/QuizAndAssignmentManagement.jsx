import React, { useState, useEffect } from 'react';
import { getInstructorCourses } from '../services/courseService';
import { createQuiz } from '../services/quizService';
import { createAssignment } from '../services/assignmentService';
import { Award, Clock, PlusCircle, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const QuizAndAssignmentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'assignment'
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Quiz Form State
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    passingPercentage: 60,
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 2,
        explanation: ''
      }
    ]
  });
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100
  });
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses();
        if (data.success) {
          setCourses(data.courses);
          if (data.courses.length > 0) {
            setSelectedCourseId(data.courses[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load instructor courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Quiz Question Helpers
  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
          marks: 2,
          explanation: ''
        }
      ]
    });
  };

  const handleRemoveQuestion = (index) => {
    if (quizForm.questions.length <= 1) return;
    const updated = quizForm.questions.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizForm.questions];
    updated[index][field] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex].options[optIndex] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setNotification({ type: 'error', message: 'Please select a course' });
      return;
    }

    setSubmittingQuiz(true);
    setNotification(null);

    try {
      const res = await createQuiz(selectedCourseId, quizForm);
      if (res.success) {
        setNotification({ type: 'success', message: 'Quiz created successfully!' });
        setQuizForm({
          title: '',
          description: '',
          passingPercentage: 60,
          questions: [
            {
              questionText: '',
              options: ['', '', '', ''],
              correctOptionIndex: 0,
              marks: 2,
              explanation: ''
            }
          ]
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create quiz'
      });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setNotification({ type: 'error', message: 'Please select a course' });
      return;
    }

    setSubmittingAssignment(true);
    setNotification(null);

    try {
      const res = await createAssignment(selectedCourseId, assignmentForm);
      if (res.success) {
        setNotification({ type: 'success', message: 'Assignment created successfully!' });
        setAssignmentForm({
          title: '',
          description: '',
          dueDate: '',
          maxMarks: 100
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create assignment'
      });
    } finally {
      setSubmittingAssignment(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assessment builder..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Quiz & Assignment Authoring
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Create multiple-choice quizzes with custom weighted marks and publish coursework assignments.
        </p>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Target Course Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 shrink-0">
          Target Course:
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.category})
            </option>
          ))}
        </select>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'quiz'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Create New Quiz
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'assignment'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Create New Assignment
        </button>
      </div>

      {/* Tab 1: Create Quiz */}
      {activeTab === 'quiz' && (
        <form onSubmit={handleQuizSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quiz Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Asynchronous Execution and Promises Mastery Quiz"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Passing Percentage (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={quizForm.passingPercentage}
                  onChange={(e) => setQuizForm({ ...quizForm, passingPercentage: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description & Instructions
              </label>
              <textarea
                rows={2}
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Guidelines for students attempting this quiz..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Questions ({quizForm.questions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Question
              </button>
            </div>

            {quizForm.questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Question #{qIdx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-slate-600">Question Marks:</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        required
                        value={q.marks}
                        onChange={(e) => handleQuestionChange(qIdx, 'marks', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                      />
                    </div>
                    {quizForm.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Question Prompt
                  </label>
                  <input
                    type="text"
                    required
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    placeholder="e.g. Which method schedules a microtask in the V8 engine?"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Options & Correct Answer
                  </label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-option-${qIdx}`}
                        checked={q.correctOptionIndex === optIdx}
                        onChange={() => handleQuestionChange(qIdx, 'correctOptionIndex', optIdx)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      {q.correctOptionIndex === optIdx && (
                        <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                          ✓ Correct Option
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Explanation (Displayed in results review)
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                    placeholder="Brief explanation of why this answer is correct..."
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingQuiz}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {submittingQuiz ? 'Publishing Quiz...' : 'Publish Quiz to Course'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Create Assignment */}
      {activeTab === 'assignment' && (
        <form onSubmit={handleAssignmentSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Assignment Specifications</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                placeholder="e.g. Design a Relational Database for E-Commerce"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Maximum Possible Marks
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  required
                  value={assignmentForm.maxMarks}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Assignment Prompt & Rubric
              </label>
              <textarea
                rows={5}
                required
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                placeholder="Provide detailed instructions, submission deliverables, format guidelines (PDF or DOCX)..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={submittingAssignment}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {submittingAssignment ? 'Creating Assignment...' : 'Publish Assignment'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizAndAssignmentManagement;
