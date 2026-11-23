import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById, getLessonById, updateLessonProgress } from '../services/courseService';
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const isYouTubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url || '');
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : url;
};

const VideoLessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [notification, setNotification] = useState(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonRes] = await Promise.all([
          getCourseById(courseId),
          getLessonById(lessonId)
        ]);

        if (courseRes.success) {
          setCourse(courseRes.course);
          if (courseRes.course.enrollment?.completedLessons) {
            setCompletedLessons(courseRes.course.enrollment.completedLessons.map(id => id.toString()));
          }
        }
        if (lessonRes.success) {
          setCurrentLesson(lessonRes.lesson);
        }
      } catch (err) {
        console.error('Failed to load lesson player:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchData();
    }
  }, [courseId, lessonId]);

  const handleMarkCompleted = async () => {
    setUpdatingProgress(true);
    try {
      const res = await updateLessonProgress(courseId, lessonId);
      if (res.success) {
        setCompletedLessons(res.completedLessons.map(id => id.toString()));
        setNotification({ type: 'success', message: 'Lesson marked as completed!' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update progress'
      });
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading video lesson player..." />;
  }

  if (!course || !currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Lesson Not Found</h2>
        <Link to={`/courses/${courseId}`} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Return to Course
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentIndex = lessons.findIndex(l => l._id.toString() === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isLessonCompleted = completedLessons.includes(lessonId.toString());

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course Overview
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-md">
            {course.title}
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Lesson {currentIndex + 1} of {lessons.length}
        </div>
      </div>

      {/* Player & Playlist Split Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Video & Lesson Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          {notification && (
            <Alert
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}

          {/* HTML5 Responsive Video Player or Embedded Player */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 relative">
            {isYouTubeUrl(currentLesson.videoUrl) ? (
              <iframe
                key={currentLesson.videoUrl}
                src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : videoError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400" />
                <h3 className="text-base font-bold text-white">Video Playback Error</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  The video stream could not be loaded. Please ensure the demonstration video is accessible.
                </p>
                <button
                  onClick={() => setVideoError(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Retry Playback
                </button>
              </div>
            ) : (
              <video
                key={currentLesson.videoUrl}
                controls
                autoPlay={false}
                preload="metadata"
                playsInline
                onCanPlay={() => setVideoError(false)}
                onError={(e) => {
                  console.error('HTML5 Video Playback Error on source:', currentLesson.videoUrl, e);
                  setVideoError(true);
                }}
                className="w-full h-full object-contain"
                src={currentLesson.videoUrl}
              >
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>

          {/* Lesson Actions & Meta */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Duration: {currentLesson.duration || '10:00'}
                  </span>
                  <span>Lesson Order: #{currentLesson.order}</span>
                </div>
              </div>

              {/* Complete / Completed Button */}
              <div>
                {isLessonCompleted ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Completed
                  </div>
                ) : (
                  <button
                    onClick={handleMarkCompleted}
                    disabled={updatingProgress}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {updatingProgress ? 'Updating...' : 'Mark as Completed'}
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lesson Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentLesson.description || 'No detailed lecture notes provided for this lesson.'}
              </p>
            </div>

            {/* Attached Study Materials */}
            {currentLesson.materials && currentLesson.materials.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attached Study Material
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.materials.map(mat => {
                    const token = localStorage.getItem('token') || '';
                    return (
                      <div
                        key={mat._id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs text-slate-200 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                              {mat.title}
                            </div>
                            <div className="text-[10px] text-slate-500">{mat.fileType} • {mat.fileSize}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`/api/materials/${mat._id}/view?token=${token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors"
                            title="View Material in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`/api/materials/${mat._id}/download?token=${token}`}
                            download
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Download Material"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prev / Next Lesson Navigation Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {prevLesson ? (
                <Link
                  to={`/courses/${courseId}/lessons/${prevLesson._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Lesson
                </Link>
              ) : <div />}

              {nextLesson ? (
                <Link
                  to={`/courses/${courseId}/lessons/${nextLesson._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-xs"
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to={`/courses/${courseId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                >
                  Back to Course Hub
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Playlist Sidebar */}
        <aside className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Course Syllabus
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {completedLessons.length} of {lessons.length} Lessons Completed
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-1">
            {lessons.map((lesson, idx) => {
              const active = lesson._id.toString() === lessonId;
              const completed = completedLessons.includes(lesson._id.toString());

              return (
                <Link
                  key={lesson._id}
                  to={`/courses/${courseId}/lessons/${lesson._id}`}
                  className={`flex items-start justify-between p-3.5 rounded-xl border text-xs transition-all ${
                    active
                      ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          active ? 'border-blue-400 text-blue-400' : 'border-slate-600 text-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${active ? 'text-blue-400' : 'text-slate-200'}`}>
                        {lesson.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {lesson.duration || '10:00'}
                      </span>
                    </div>
                  </div>

                  {active && (
                    <PlayCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoLessonPlayer;
