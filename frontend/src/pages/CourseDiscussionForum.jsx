import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getCourseDiscussions,
  createDiscussion,
  getDiscussionReplies,
  createReply
} from '../services/discussionService';
import {
  MessageSquare,
  Send,
  PlusCircle,
  Clock,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { formatRelativeTime } from '../utils/formatters';

const CourseDiscussionForum = ({ courseId: propCourseId, isEnrolled, isInstructor }) => {
  const params = useParams();
  const courseId = propCourseId || params.id;
  const { user } = useAuth();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submittingThread, setSubmittingThread] = useState(false);
  const [threadError, setThreadError] = useState('');

  // Expanded thread replies state
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [repliesMap, setRepliesMap] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [replyTextMap, setReplyTextMap] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});
  const [replyErrorMap, setReplyErrorMap] = useState({});

  const fetchDiscussions = async () => {
    try {
      const data = await getCourseDiscussions(courseId);
      if (data.success) {
        setDiscussions(data.discussions);
      }
    } catch (err) {
      console.error('Failed to load discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchDiscussions();
    }
  }, [courseId]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    setThreadError('');

    if (!newTitle.trim() || !newContent.trim()) {
      setThreadError('Please provide both question title and details. Empty messages cannot be submitted.');
      return;
    }

    setSubmittingThread(true);
    try {
      const data = await createDiscussion(courseId, {
        title: newTitle.trim(),
        content: newContent.trim()
      });
      if (data.success) {
        setNewTitle('');
        setNewContent('');
        setShowNewThreadModal(false);
        await fetchDiscussions();
      }
    } catch (err) {
      setThreadError(err.response?.data?.message || 'Failed to post discussion question.');
    } finally {
      setSubmittingThread(false);
    }
  };

  const toggleThreadReplies = async (threadId) => {
    if (expandedThreadId === threadId) {
      setExpandedThreadId(null);
      return;
    }

    setExpandedThreadId(threadId);

    // Fetch replies if not yet loaded
    if (!repliesMap[threadId]) {
      setLoadingReplies(prev => ({ ...prev, [threadId]: true }));
      try {
        const data = await getDiscussionReplies(threadId);
        if (data.success) {
          setRepliesMap(prev => ({ ...prev, [threadId]: data.replies }));
        }
      } catch (err) {
        console.error('Failed to load thread replies:', err);
      } finally {
        setLoadingReplies(prev => ({ ...prev, [threadId]: false }));
      }
    }
  };

  const handlePostReply = async (threadId) => {
    const text = replyTextMap[threadId];
    if (!text || !text.trim()) {
      setReplyErrorMap(prev => ({ ...prev, [threadId]: 'Reply message cannot be empty' }));
      return;
    }

    setSubmittingReply(prev => ({ ...prev, [threadId]: true }));
    setReplyErrorMap(prev => ({ ...prev, [threadId]: '' }));

    try {
      const data = await createReply(threadId, text.trim());
      if (data.success) {
        // Append reply to existing list
        setRepliesMap(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), data.reply]
        }));
        setReplyTextMap(prev => ({ ...prev, [threadId]: '' }));
        // Refresh discussion reply count
        fetchDiscussions();
      }
    } catch (err) {
      setReplyErrorMap(prev => ({
        ...prev,
        [threadId]: err.response?.data?.message || 'Failed to submit reply'
      }));
    } finally {
      setSubmittingReply(prev => ({ ...prev, [threadId]: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading discussion threads..." />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Course Discussion Forum
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions, clarify complex lecture concepts, and collaborate with instructors and fellow classmates.
          </p>
        </div>

        {(isEnrolled || isInstructor) && (
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Ask a Question
          </button>
        )}
      </div>

      {/* New Question Form Modal / Dropdown */}
      {showNewThreadModal && (
        <form
          onSubmit={handleCreateThread}
          className="bg-slate-50 border border-blue-200 rounded-xl p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Post a New Discussion Question
            </h4>
            <button
              type="button"
              onClick={() => setShowNewThreadModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Cancel
            </button>
          </div>

          {threadError && <Alert type="error" message={threadError} />}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Question Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. How does lexical scoping affect nested callbacks?"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Details & Context
            </label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Provide specific details about your question, relevant code snippets, or lecture timestamps..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewThreadModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingThread}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {submittingThread ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      )}

      {/* Discussion List */}
      {discussions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No discussions posted yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first to ask a question! All enrolled students and the course instructor can read and reply to threads.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((disc) => {
            const isExpanded = expandedThreadId === disc._id;
            const replies = repliesMap[disc._id] || [];
            const isThreadLoading = loadingReplies[disc._id];
            const isAuthorInstructor = disc.authorId?.role === 'instructor';

            return (
              <div
                key={disc._id}
                className="rounded-xl border border-slate-200 hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Thread Card Header */}
                <div className="p-5 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {disc.authorId?.name ? disc.authorId.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {disc.authorId?.name || 'Anonymous User'}
                          </span>
                          {isAuthorInstructor && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              <ShieldCheck className="w-3 h-3" />
                              Instructor
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatRelativeTime(disc.createdAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleThreadReplies(disc._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>{disc.replyCount || 0} Replies</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {disc.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {disc.content}
                    </p>
                  </div>
                </div>

                {/* Expanded Thread Replies Area */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Replies ({replies.length})
                    </h5>

                    {isThreadLoading ? (
                      <LoadingSpinner text="Loading conversation replies..." />
                    ) : replies.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No replies yet. Share an answer or clarification below.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {replies.map((reply) => {
                          const isReplyInstructor = reply.authorId?.role === 'instructor';
                          return (
                            <div
                              key={reply._id}
                              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                                isReplyInstructor
                                  ? 'bg-blue-50/70 border-blue-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">
                                    {reply.authorId?.name || 'User'}
                                  </span>
                                  {isReplyInstructor && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">
                                      <ShieldCheck className="w-2.5 h-2.5" />
                                      Instructor
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {formatRelativeTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                                {reply.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Post Reply Input Box */}
                    {(isEnrolled || isInstructor) ? (
                      <div className="pt-2 space-y-2">
                        {replyErrorMap[disc._id] && (
                          <Alert type="error" message={replyErrorMap[disc._id]} />
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyTextMap[disc._id] || ''}
                            onChange={(e) =>
                              setReplyTextMap({
                                ...replyTextMap,
                                [disc._id]: e.target.value
                              })
                            }
                            placeholder="Write a constructive reply..."
                            className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePostReply(disc._id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(disc._id)}
                            disabled={submittingReply[disc._id]}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {submittingReply[disc._id] ? 'Posting...' : 'Reply'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Enroll in this course to join the discussion.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseDiscussionForum;
