import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCourseMaterials, getCourses } from '../services/courseService';
import { FileText, Download, BookOpen, Search, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const StudyMaterials = () => {
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get('courseId');

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseIdParam || '');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const coursesRes = await getCourses();
        if (coursesRes.success) {
          setCourses(coursesRes.courses);
          if (!selectedCourseId && coursesRes.courses.length > 0) {
            setSelectedCourseId(coursesRes.courses[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load courses for materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!selectedCourseId) return;
      setLoading(true);
      try {
        const data = await getCourseMaterials(selectedCourseId);
        if (data.success) {
          setMaterials(data.materials);
        }
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [selectedCourseId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Study Materials & Handbooks
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Download PDF guides, lecture slides, and cheat sheets uploaded by instructors.
        </p>
      </div>

      {/* Course Selector Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
          Select Course:
        </span>
        {courses.map((course) => (
          <button
            key={course._id}
            onClick={() => setSelectedCourseId(course._id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCourseId === course._id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* Materials Listing */}
      {loading ? (
        <LoadingSpinner text="Fetching study materials..." />
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No materials uploaded for this course</h3>
          <p className="text-xs text-slate-500">
            Check back later as the instructor uploads more reference documents.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div
              key={mat._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {mat.fileType}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{mat.fileSize}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{mat.title}</h3>
                  {mat.lessonId && (
                    <p className="text-xs text-slate-500 mt-1">
                      Associated Lesson: {mat.lessonId.title || 'Course Module'}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Uploaded {new Date(mat.uploadedAt).toLocaleDateString()}
                </span>
                <a
                  href={`/api/materials/${mat._id}/download`}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
