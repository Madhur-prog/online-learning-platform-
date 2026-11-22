import React, { useState, useEffect } from 'react';
import { getInstructorCourses, getCourseById } from '../services/courseService';
import { getAssignmentSubmissions, gradeSubmission } from '../services/assignmentService';
import { 
  CheckSquare, 
  Download, 
  Award, 
  Clock, 
  CheckCircle2, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { getStatusBadgeColor } from '../utils/formatters';

const StudentSubmissionReview = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

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
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch course details to get its assignments
  useEffect(() => {
    const fetchCourseAssignments = async () => {
      if (!selectedCourseId) return;
      try {
        const data = await getCourseById(selectedCourseId);
        if (data.success && data.course.assignments) {
          setAssignments(data.course.assignments);
          if (data.course.assignments.length > 0) {
            setSelectedAssignmentId(data.course.assignments[0]._id);
          } else {
            setSelectedAssignmentId('');
            setSubmissions([]);
          }
        }
      } catch (err) {
        console.error('Failed to load course assignments:', err);
      }
    };

    fetchCourseAssignments();
  }, [selectedCourseId]);

  // Fetch submissions for chosen assignment
  const fetchSubmissions = async () => {
    if (!selectedAssignmentId) return;
    try {
      const data = await getAssignmentSubmissions(selectedAssignmentId);
      if (data.success) {
        setSubmissions(data.submissions);
        setCurrentAssignment(data.assignment);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedAssignmentId]);

  const handleOpenGradeModal = (sub) => {
    setGradingSubmission(sub);
    setMarksInput(sub.marks !== null && sub.marks !== undefined ? sub.marks : '');
    setFeedbackInput(sub.feedback || '');
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const numMarks = Number(marksInput);
    if (isNaN(numMarks) || numMarks < 0 || (currentAssignment && numMarks > currentAssignment.maxMarks)) {
      setNotification({
        type: 'error',
        message: `Marks must be between 0 and maximum possible marks (${currentAssignment?.maxMarks || 100})`
      });
      return;
    }

    setSubmittingGrade(true);
    setNotification(null);

    try {
      const res = await gradeSubmission(gradingSubmission._id, {
        marks: numMarks,
        feedback: feedbackInput
      });

      if (res.success) {
        setNotification({ type: 'success', message: 'Student submission graded successfully!' });
        setGradingSubmission(null);
        await fetchSubmissions();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit grade'
      });
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading submission review console..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Submission Review & Grading
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Inspect student uploaded PDF and DOCX files, award marks, and provide qualitative feedback.
        </p>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Selectors Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Select Course:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Select Assignment:
          </label>
          {assignments.length > 0 ? (
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
            >
              {assignments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title} (Max: {a.maxMarks})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-slate-400 py-2">No assignments found for this course.</p>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Submissions Received ({submissions.length})
          </h3>
          {currentAssignment && (
            <span className="text-xs text-slate-500">
              Max Marks: <strong>{currentAssignment.maxMarks}</strong>
            </span>
          )}
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No submissions received yet</h4>
            <p className="text-xs text-slate-500">
              When students upload their assignments, they will appear here for evaluation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-4">Uploaded File</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Marks Awarded</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {submissions.map((sub) => {
                  const student = sub.studentId || {};
                  return (
                    <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{student.name || 'Student'}</div>
                        <span className="text-[11px] text-slate-400">{student.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                            {sub.fileType || 'PDF'}
                          </span>
                          <span className="truncate max-w-[140px] text-slate-700">
                            {sub.originalFileName}
                          </span>
                          <a
                            href={`/api/submissions/${sub._id}/download`}
                            download
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(sub.submittedAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusBadgeColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {sub.status === 'Graded' ? (
                          <span className="font-bold text-emerald-700 text-sm">
                            {sub.marks} / {currentAssignment?.maxMarks || 100}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not graded</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Grade Student Submission
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>Student: <strong>{gradingSubmission.studentId?.name}</strong></p>
              <p>File: <strong>{gradingSubmission.originalFileName}</strong></p>
              <p>Max Allowed Marks: <strong>{currentAssignment?.maxMarks || 100}</strong></p>
            </div>

            <form onSubmit={handleSubmitGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Marks Awarded (0 - {currentAssignment?.maxMarks || 100})
                </label>
                <input
                  type="number"
                  min={0}
                  max={currentAssignment?.maxMarks || 100}
                  required
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  placeholder="e.g. 95"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructor Feedback & Remarks
                </label>
                <textarea
                  rows={4}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Constructive feedback, rubric notes, and areas for improvement..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50"
                >
                  {submittingGrade ? 'Saving Grade...' : 'Save Grade & Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissionReview;
