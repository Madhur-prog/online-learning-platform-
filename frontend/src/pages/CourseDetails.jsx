import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCourseById, enrollInCourse } from '../services/courseService';
import { 
  PlayCircle, 
  BookOpen, 
  FileText, 
  Award, 
  Clock, 
  Users, 
  CheckCircle, 
  MessageSquare,
  Download,
  AlertCircle,
  Calendar,
  Send,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import CourseDiscussionForum from './CourseDiscussionForum';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isInstructor } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('syllabus');
  const [notification, setNotification] = useState(null);

  const fetchCourse = async () => {
    try {
      const data = await getCourseById(id);
      if (data.success) {
        setCourse(data.course);
      }
    } catch (err) {
      console.error('Failed to fetch course details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      const data = await enrollInCourse(id);
      if (data.success) {
        setNotification({ type: 'success', message: 'Successfully enrolled in course!' });
        await fetchCourse();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Enrollment failed. Please try again.'
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested course could not be located.</p>
        <Link to="/courses" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  const isEnrolled = course.isEnrolled;
  const isCourseInstructor = isInstructor && course.instructorId?._id === user?._id;

  return (
    <div className="space-y-8 pb-16">
      {/* Course Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                  {course.level || 'Beginner'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {course.description}
              </p>

              {/* Course Meta Info */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                    {course.instructorId?.name ? course.instructorId.name.charAt(0) : 'I'}
                  </div>
                  <span>Instructor: <strong className="text-white">{course.instructorId?.name}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>{course.lessons?.length || 0} Lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{course.enrolledCount || 0} Students Enrolled</span>
                </div>
              </div>
            </div>

            {/* Right Side Enrollment / Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-xl border border-slate-200">
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-5 relative group">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.lessons && course.lessons.length > 0 && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg text-xs font-bold border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      You are enrolled in this course
                    </div>

                    {course.lessons && course.lessons.length > 0 ? (
                      <Link
                        to={`/courses/${course._id}/lessons/${course.lessons[0]._id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Go to Lessons
                      </Link>
                    ) : (
                      <p className="text-xs text-slate-500 text-center">Lessons are being prepared.</p>
                    )}
                  </div>
                ) : isCourseInstructor ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-2 rounded-lg text-xs font-bold border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      You are teaching this course
                    </div>
                    <Link
                      to="/instructor/courses"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
                    >
                      Manage Course Content
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'syllabus'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Syllabus & Lessons ({course.lessons?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Study Materials ({course.materials?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'quizzes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Quizzes ({course.quizzes?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Assignments ({course.assignments?.length || 0})
          </button>

          {/* Discussion Forum Tab (Requirement Change) */}
          <button
            onClick={() => setActiveTab('discussions')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'discussions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Discussion Forum
          </button>
        </div>

        {/* Tab 1: Syllabus & Lessons */}
        {activeTab === 'syllabus' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Course Syllabus</h3>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {lesson.description || 'Lecture video and conceptual review.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400 font-medium">
                        {lesson.duration || '10:00'}
                      </span>
                      {isEnrolled || isCourseInstructor ? (
                        <Link
                          to={`/courses/${course._id}/lessons/${lesson._id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Watch
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Enroll to view</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No lessons uploaded yet for this course.</p>
            )}
          </div>
        )}

        {/* Tab 2: Study Materials */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Downloadable Study Materials</h3>
            <p className="text-xs text-slate-500">
              Supplementary resources, handbooks, and lecture slide decks provided by the instructor.
            </p>

            {course.materials && course.materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {course.materials.map((mat) => (
                  <div
                    key={mat._id}
                    className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        {mat.fileType}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{mat.title}</h4>
                        <span className="text-xs text-slate-400">{mat.fileSize}</span>
                      </div>
                    </div>

                    {isEnrolled || isCourseInstructor ? (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`/api/materials/${mat._id}/view?token=${localStorage.getItem('token') || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="View PDF Material"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a
                          href={`/api/materials/${mat._id}/download?token=${localStorage.getItem('token') || ''}`}
                          download
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Enroll to download</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No study materials available yet.</p>
            )}
          </div>
        )}

        {/* Tab 3: Quizzes */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Course Quizzes & Assessments</h3>
                <p className="text-xs text-slate-500">
                  Complete all 3 structured quizzes to validate your understanding from fundamentals to advanced concepts.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {course.quizzes?.length || 0} Quizzes Available
              </span>
            </div>

            {course.quizzes && course.quizzes.length > 0 ? (
              <div className="space-y-4 pt-2">
                {course.quizzes.map((quiz, idx) => {
                  const difficultyColor = 
                    quiz.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    quiz.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-purple-50 text-purple-700 border-purple-200';

                  const totalMarks = quiz.totalMarks || (quiz.questions?.length || 0) * 2;

                  return (
                    <div
                      key={quiz._id}
                      className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-400">Quiz #{idx + 1}</span>
                          <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor}`}>
                            {quiz.difficulty || 'Beginner'}
                          </span>
                          {quiz.hasAttempted ? (
                            quiz.latestAttempt?.passed ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Passed ({quiz.latestAttempt.percentage}%)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                Attempted ({quiz.latestAttempt?.percentage || 0}%)
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              Not Attempted
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{quiz.description}</p>

                        <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 font-medium">
                          <span>{quiz.questions?.length || 0} Questions</span>
                          <span>Total Marks: {totalMarks}</span>
                          <span>Passing Score: {quiz.passingPercentage}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                        {isEnrolled ? (
                          <>
                            {quiz.hasAttempted && quiz.latestAttempt && (
                              <Link
                                to={`/quizzes/results/${quiz.latestAttempt._id}`}
                                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                              >
                                View Result
                              </Link>
                            )}
                            <Link
                              to={`/quizzes/${quiz._id}`}
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                            >
                              {quiz.hasAttempted ? 'Retake Quiz' : 'Start Quiz'}
                            </Link>
                          </>
                        ) : isCourseInstructor ? (
                          <Link
                            to={`/instructor/quizzes`}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Manage Quizzes
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Enroll to attempt</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No quizzes posted for this course yet.</p>
            )}
          </div>
        )}

        {/* Tab 4: Assignments */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Course Assignments</h3>
                <p className="text-xs text-slate-500">
                  Complete all 3 hands-on practical assignments (PDF/DOCX) for instructor evaluation and grading.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                {course.assignments?.length || 0} Assignments Available
              </span>
            </div>

            {course.assignments && course.assignments.length > 0 ? (
              <div className="space-y-4 pt-2">
                {course.assignments.map((assign, idx) => {
                  const difficultyColor = 
                    assign.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    assign.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-purple-50 text-purple-700 border-purple-200';

                  const status = assign.status || 'Not Submitted';
                  const statusColor = 
                    status === 'Graded' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    status === 'Submitted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    status === 'Late' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <div
                      key={assign._id}
                      className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-400">Assignment #{idx + 1}</span>
                          <h4 className="text-sm font-bold text-slate-900">{assign.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor}`}>
                            {assign.difficulty || 'Intermediate'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                            {status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">{assign.description}</p>

                        <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 font-medium">
                          <span>Max Marks: {assign.maxMarks}</span>
                          <span>Due Date: {new Date(assign.dueDate).toLocaleDateString()}</span>
                          <span>Formats: PDF, DOCX</span>
                        </div>

                        {/* If graded, show marks and feedback */}
                        {assign.submission && assign.submission.status === 'Graded' && (
                          <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-900">
                            <div className="font-bold flex items-center gap-2">
                              <span>Grade Awarded: {assign.submission.marks} / {assign.maxMarks}</span>
                            </div>
                            {assign.submission.feedback && (
                              <p className="text-slate-600 italic">
                                Instructor Feedback: "{assign.submission.feedback}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                        {isEnrolled ? (
                          <>
                            {status !== 'Not Submitted' ? (
                              <Link
                                to={`/assignments/${assign._id}/status`}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                View Status
                              </Link>
                            ) : (
                              <Link
                                to={`/assignments/${assign._id}`}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Submit Assignment
                              </Link>
                            )}
                          </>
                        ) : isCourseInstructor ? (
                          <Link
                            to={`/instructor/submissions`}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Review Submissions
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Enroll to submit</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No assignments created yet for this course.</p>
            )}
          </div>
        )}

        {/* Tab 5: Discussion Forum (Requirement Change) */}
        {activeTab === 'discussions' && (
          <div className="pt-2">
            <CourseDiscussionForum
              courseId={course._id}
              isEnrolled={isEnrolled}
              isInstructor={isCourseInstructor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
