import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEnrolledCourses } from '../services/courseService';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  FileText, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getEnrolledCourses();
        if (data.success) {
          setEnrollments(data.enrollments);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress = totalCourses > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCourses)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider mb-3">
            Student Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Pick up right where you left off. Access your enrolled lectures, prepare for upcoming quizzes, and submit your coursework.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Enrolled</p>
            <h3 className="text-2xl font-black text-slate-900">{totalCourses}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">In Progress</p>
            <h3 className="text-2xl font-black text-slate-900">{inProgressCourses}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Completed</p>
            <h3 className="text-2xl font-black text-slate-900">{completedCourses}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Avg. Progress</p>
            <h3 className="text-2xl font-black text-slate-900">{averageProgress}%</h3>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Enrolled Courses</h2>
          <Link
            to="/courses"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Explore More Courses
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">You haven't enrolled in any courses yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse our catalog to start building skills today.</p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {enrollments.map((item) => {
              const course = item.course;
              return (
                <div
                  key={item.enrollmentId}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                          {course.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                      <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.completedLessonsCount} / {item.totalLessons} Lessons
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="pt-2">
                      <ProgressBar progress={item.progress} size="sm" />
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Instructor: {course.instructorId?.name || 'Faculty'}
                    </span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Continue Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
