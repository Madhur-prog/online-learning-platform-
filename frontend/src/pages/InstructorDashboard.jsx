import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getInstructorCourses } from '../services/courseService';
import { 
  BookOpen, 
  Users, 
  PlusCircle, 
  FileText, 
  Award, 
  CheckSquare, 
  TrendingUp, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to load instructor courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading instructor portal..." />;
  }

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessonCount || 0), 0);
  const totalAssessments = courses.reduce((acc, c) => acc + (c.quizCount || 0) + (c.assignmentCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-3">
            Instructor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}!
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Manage your courses, author video lessons and study guides, publish quizzes, and grade student submissions.
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
            <p className="text-xs font-semibold text-slate-500 uppercase">Courses Taught</p>
            <h3 className="text-2xl font-black text-slate-900">{totalCourses}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Enrolled Students</p>
            <h3 className="text-2xl font-black text-slate-900">{totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Lessons</p>
            <h3 className="text-2xl font-black text-slate-900">{totalLessons}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Assessments</p>
            <h3 className="text-2xl font-black text-slate-900">{totalAssessments}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/instructor/courses"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create or Edit Course
        </Link>
        <Link
          to="/instructor/quizzes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Award className="w-4 h-4" />
          Create Quiz / Assignment
        </Link>
        <Link
          to="/instructor/submissions"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
        >
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          Grade Submissions
        </Link>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Active Courses</h2>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No courses authored yet</h3>
            <p className="text-xs text-slate-500">Create your first course to begin teaching.</p>
            <Link
              to="/instructor/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Course Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Lessons</th>
                    <th className="py-3.5 px-4">Enrolled Students</th>
                    <th className="py-3.5 px-4">Assessments</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{course.title}</div>
                        <span className="text-[11px] text-slate-400">Level: {course.level}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{course.category}</td>
                      <td className="py-4 px-4 text-slate-600">{course.lessonCount || 0}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{course.enrolledCount || 0}</td>
                      <td className="py-4 px-4 text-slate-600">
                        {course.quizCount || 0} Quizzes, {course.assignmentCount || 0} Assignments
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <Link
                          to={`/courses/${course._id}`}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/instructor/courses`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
