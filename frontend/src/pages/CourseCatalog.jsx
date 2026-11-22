import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, BookOpen } from 'lucide-react';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'Web Development',
    'Programming',
    'Database Management',
    'Data Science',
    'Software Engineering'
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses(category, search);
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Course Catalog
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Browse comprehensive university-standard courses. Enroll in beginner to advanced tracks with high-definition lectures and direct instructor communication.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by keyword..."
            className="w-full pl-10 pr-20 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <LoadingSpinner text="Searching courses..." />
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your filter criteria</h3>
          <p className="text-xs text-slate-500">
            Try clearing your search query or selecting "All" categories.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
