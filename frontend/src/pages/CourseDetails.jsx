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
  Send
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
                      <a
                        href={`/api/materials/${mat._id}/download`}
                        download
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Download file"
                      >
                        <Download className="w-5 h-5" />
                      </a>
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
            <h3 className="text-lg font-bold text-slate-900">Course Quizzes & Assessments</h3>
            <p className="text-xs text-slate-500">
              Test your grasp of lecture concepts. Scores are automatically calculated by the backend system.
            </p>

            {course.quizzes && course.quizzes.length > 0 ? (
              <div className="space-y-3 pt-2">
                {course.quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{quiz.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>{quiz.questions?.length || 0} Questions</span>
                        <span>Passing: {quiz.passingPercentage}%</span>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <Link
                        to={`/quizzes/${quiz._id}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Start Quiz
                      </Link>
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
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No quizzes posted for this course yet.</p>
            )}
          </div>
        )}

        {/* Tab 4: Assignments */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Course Assignments</h3>
            <p className="text-xs text-slate-500">
              Submit hands-on assignments in PDF or DOCX format for instructor review.
            </p>

            {course.assignments && course.assignments.length > 0 ? (
              <div className="space-y-3 pt-2">
                {course.assignments.map((assign) => (
                  <div
                    key={assign._id}
                    className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{assign.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{assign.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Max Marks: {assign.maxMarks}</span>
                        <span>Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <Link
                        to={`/assignments/${assign._id}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        View & Submit
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Enroll to submit</span>
                    )}
                  </div>
                ))}
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
