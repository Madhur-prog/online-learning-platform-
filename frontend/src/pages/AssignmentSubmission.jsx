import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssignmentById, submitAssignment } from '../services/assignmentService';
import { 
  FileText, 
  Upload, 
  Calendar, 
  Award, 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { formatDate } from '../utils/formatters';

const AssignmentSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignmentById(id);
        if (data.success) {
          setAssignment(data.assignment);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExt = ['.pdf', '.docx'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExt.includes(fileExt)) {
        setError('Unsupported file type. Please upload a valid PDF or DOCX document.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError('File size exceeds the 15MB limit.');
        setSelectedFile(null);
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF or DOCX file to submit.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await submitAssignment(id, formData);
      if (res.success) {
        setSuccess('Assignment submitted successfully! Redirecting to submission status...');
        setTimeout(() => {
          navigate(`/assignments/${id}/status`, { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assignment specifications..." />;
  }

  if (!assignment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Assignment not found'} />
        <Link to="/courses" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Courses
        </Link>
      </div>
    );
  }

  const isDueDatePassed = new Date() > new Date(assignment.dueDate);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to={`/courses/${assignment.courseId?._id || assignment.courseId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Overview
        </Link>
      </div>

      {/* Assignment Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                Assignment
              </span>
              <span className="text-xs text-slate-500">
                Course: {assignment.courseId?.title || 'Course'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {assignment.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px] uppercase">Max Marks</span>
              <span className="text-lg text-slate-900">{assignment.maxMarks}</span>
            </div>
          </div>
        </div>

        {/* Due Date & Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Due Date: <strong>{new Date(assignment.dueDate).toLocaleString()}</strong></span>
          </div>

          <div>
            {isDueDatePassed ? (
              <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Past Due (Submissions will be marked Late)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                Open for Submission
              </span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Submission Instructions
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {assignment.description}
          </p>
        </div>

        {assignment.submission && (
          <div className="pt-2">
            <Link
              to={`/assignments/${id}/status`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              You have already submitted this assignment. View Submission Status & Feedback →
            </Link>
          </div>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      {/* Upload Dropzone Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload Assignment File
        </h3>

        <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
          <input
            type="file"
            id="assignment-file-input"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="assignment-file-input" className="cursor-pointer space-y-3 block">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click to browse or drag and drop your file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Accepted formats: <strong>PDF, DOCX</strong> (Maximum 15MB)
              </p>
            </div>
            {selectedFile && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                File Selected: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Ensure your submission meets all academic guidelines before uploading.
          </span>
          <button
            type="submit"
            disabled={submitting || !selectedFile}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
          >
            {submitting ? 'Uploading to Server...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentSubmission;
