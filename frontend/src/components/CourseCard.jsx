import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, PlayCircle } from 'lucide-react';

const CourseCard = ({ course, isEnrolled, progress }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 shadow-xs">
          {course.level || 'Beginner'}
        </div>
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs">
          {course.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 flex-1">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
            {course.instructorId?.name ? course.instructorId.name.charAt(0) : 'I'}
          </div>
          <span className="text-xs font-medium text-slate-700 truncate">
            {course.instructorId?.name || 'Instructor'}
          </span>
        </div>

        {/* Metadata stats */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.lessonCount || 0} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.enrolledCount || 0} Students</span>
          </div>
        </div>

        {/* Action Button / Progress */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {isEnrolled ? (
            <div>
              {progress !== undefined && (
                <div className="mb-2.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <Link
                to={`/courses/${course._id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                Continue Learning
              </Link>
            </div>
          ) : (
            <Link
              to={`/courses/${course._id}`}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs"
            >
              View Course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
