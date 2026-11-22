import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssignmentStatus } from '../services/assignmentService';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Award,
  MessageSquare,
  Upload
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { getStatusBadgeColor } from '../utils/formatters';

const AssignmentStatus = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getAssignmentStatus(id);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load submission status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Retrieving assignment submission status..." />;
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={error || 'Submission status not found'} />
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { assignment, submission, status } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to={`/assignments/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assignment Details
        </Link>
      </div>

      {/* Main Status Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusBadgeColor(status)}`}>
                {status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {assignment.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={`/assignments/${id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Re-upload File
            </Link>
          </div>
        </div>

        {/* Submission Details */}
        {submission ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Info Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">Submitted Document</span>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {submission.fileType || 'PDF'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                        {submission.originalFileName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/api/submissions/${submission._id}/download`}
                    download
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors shadow-2xs"
                    title="Download submitted copy"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Status & Deadline Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400">Deadline & Timing</span>
                <div className="space-y-1 pt-1 text-xs text-slate-600">
                  <p>Due Date: <strong>{new Date(assignment.dueDate).toLocaleString()}</strong></p>
                  <p>
                    Submission Type:{' '}
                    <strong className={submission.status === 'Late' ? 'text-amber-600' : 'text-emerald-600'}>
                      {submission.status === 'Late' ? 'Late Submission' : 'On-Time Submission'}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor Grade and Feedback Area */}
            {submission.status === 'Graded' ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Evaluation & Feedback
                  </h3>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-800">Score Awarded: </span>
                    <span className="text-xl font-black text-emerald-900">
                      {submission.marks} / {assignment.maxMarks}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Instructor Remarks:
                  </span>
                  <p className="text-xs text-slate-800 bg-white p-4 rounded-xl border border-emerald-200 leading-relaxed whitespace-pre-line">
                    {submission.feedback || 'Great submission! All functional requirements fulfilled.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-900 flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong>Submission Pending Review:</strong> Your uploaded file is queued for grading by the course instructor. Marks and feedback will be posted here once evaluated.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">You have not submitted this assignment yet</h3>
            <Link
              to={`/assignments/${id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              <Upload className="w-4 h-4" />
              Upload Solution Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentStatus;
