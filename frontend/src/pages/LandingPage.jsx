import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  PlayCircle, 
  Sparkles,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';

const LandingPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ['All', 'Web Development', 'Programming', 'Database Management'];

  const filteredCourses = selectedCategory === 'All'
    ? courses.slice(0, 4)
    : courses.filter(c => c.category === selectedCategory).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Modern Online Education Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Learn Without Limits. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                  Build Practical Skills.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Experience high-definition video lectures, downloadable curricula, instant quiz assessments, verified assignments, and active course community discussions.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
                >
                  Explore Course Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Join as Student
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-slate-400">Verified Curriculum</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">Interactive</div>
                  <div className="text-xs text-slate-400">Video & Quizzes</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">Community</div>
                  <div className="text-xs text-slate-400">Course Forums</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Live Course Preview</span>
                </div>

                <div className="aspect-video rounded-xl overflow-hidden bg-slate-800 relative mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60"
                    alt="JavaScript Fundamentals"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span className="font-semibold text-white">JavaScript Fundamentals</span>
                    <span className="text-emerald-400 font-bold">In Progress</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Online Courses
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Browse instructor-led courses designed for foundational mastery and applied practice.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading courses..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Value Propositions / Why LearnSphere */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Complete Online Learning Experience
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything students and educators need for rigorous, engaging distance education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Structured Video Lessons</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sequential lecture modules with built-in playback controls, completion tracking, and attached study guides.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Automated Quizzes & Grading</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Backend-calculated score algorithms supporting weighted questions, immediate score summaries, and answer reviews.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Course Discussion Forums</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask questions, clarify concepts, and receive direct replies from instructors and peer learners within each course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-700/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to begin your learning journey?</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Create an account now to explore free and instructor-guided courses in web development, database management, and programming.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 px-8 py-3.5 rounded-xl bg-white text-blue-700 font-extrabold text-sm hover:bg-blue-50 shadow-md transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
