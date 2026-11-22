import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEnrolledCourses } from '../services/courseService';
import { BookOpen, PlayCircle, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getEnrolledCourses();
        if (data.success) {
          setEnrollments(data.enrollments);
        }
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading enrolled courses..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Learning
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Track your course completion, review completed modules, and resume your lectures.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Enrolled Courses</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven't enrolled in any courses yet. Explore our catalog to begin.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Explore Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => {
            const course = item.course;
            return (
              <div
                key={item.enrollmentId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs">
                      {course.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="pt-2">
                      <ProgressBar progress={item.progress} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {item.completedLessonsCount} of {item.totalLessons} Lessons
                    </span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Resume Course
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLearning;
