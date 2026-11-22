import React, { useState, useEffect } from 'react';
import { 
  getInstructorCourses, 
  createCourse, 
  createLesson, 
  uploadStudyMaterial 
} from '../services/courseService';
import { 
  BookOpen, 
  PlusCircle, 
  Video, 
  FileText, 
  CheckCircle, 
  Trash2, 
  Upload, 
  PlayCircle,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // New Course Modal State
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: ''
  });
  const [creatingCourse, setCreatingCourse] = useState(false);

  // New Lesson State
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '10:00',
    order: 1
  });
  const [creatingLesson, setCreatingLesson] = useState(false);

  // New Study Material State
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await getInstructorCourses();
      if (data.success) {
        setCourses(data.courses);
        if (!selectedCourse && data.courses.length > 0) {
          setSelectedCourse(data.courses[0]);
        } else if (selectedCourse) {
          const updated = data.courses.find(c => c._id === selectedCourse._id);
          if (updated) setSelectedCourse(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch instructor courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreatingCourse(true);
    setNotification(null);

    try {
      const res = await createCourse(courseForm);
      if (res.success) {
        setNotification({ type: 'success', message: 'Course created successfully!' });
        setShowCreateCourseModal(false);
        setCourseForm({
          title: '',
          description: '',
          category: 'Web Development',
          level: 'Beginner',
          thumbnail: ''
        });
        await fetchCourses();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create course'
      });
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setCreatingLesson(true);
    setNotification(null);

    try {
      const res = await createLesson(selectedCourse._id, lessonForm);
      if (res.success) {
        setNotification({ type: 'success', message: 'Lesson added to syllabus!' });
        setLessonForm({
          title: '',
          description: '',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: '10:00',
          order: (selectedCourse.lessonCount || 0) + 2
        });
        await fetchCourses();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add lesson'
      });
    } finally {
      setCreatingLesson(false);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !materialFile) {
      setNotification({ type: 'error', message: 'Please select a file and provide a title' });
      return;
    }

    setUploadingMaterial(true);
    setNotification(null);

    const formData = new FormData();
    formData.append('title', materialTitle);
    formData.append('file', materialFile);

    try {
      const res = await uploadStudyMaterial(selectedCourse._id, formData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Study material uploaded successfully!' });
        setMaterialTitle('');
        setMaterialFile(null);
        await fetchCourses();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload material'
      });
    } finally {
      setUploadingMaterial(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course manager..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Course Content Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create courses, configure lessons, video URLs, and publish downloadable resources.
          </p>
        </div>

        <button
          onClick={() => setShowCreateCourseModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modal for Creating New Course */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create a New Course</h3>
              <button
                onClick={() => setShowCreateCourseModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Microservices"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Programming">Programming</option>
                  <option value="Database Management">Database Management</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Difficulty Level
                </label>
                <select
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Outline course learning outcomes and topics covered..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCourse}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50"
                >
                  {creatingCourse ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Course Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
          Managing Course:
        </span>
        {courses.map((course) => (
          <button
            key={course._id}
            onClick={() => setSelectedCourse(course)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCourse?._id === course._id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Lesson Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Add Lesson to {selectedCourse.title}
            </h3>

            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Asynchronous Execution and Promises"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Educational Video URL (MP4 Stream)
                </label>
                <input
                  type="url"
                  required
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="12:30"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lesson Order #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lesson Notes & Summary
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Summary of topics covered in this lecture..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={creatingLesson}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                {creatingLesson ? 'Adding Lesson...' : 'Save Lesson to Syllabus'}
              </button>
            </form>
          </div>

          {/* Upload Study Material Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Upload Study Material (PDF, DOCX, PPTX)
            </h3>

            <form onSubmit={handleUploadMaterial} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Normalization & Functional Dependencies"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select File (PDF, DOCX, PPTX)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.pptx"
                  onChange={(e) => setMaterialFile(e.target.files[0])}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingMaterial || !materialFile}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                {uploadingMaterial ? 'Uploading File...' : 'Upload Study Document'}
              </button>
            </form>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
              <p className="font-semibold text-slate-800">Supported File Formats:</p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li>PDF (.pdf) - Lecture notes and handbooks</li>
                <li>DOCX (.docx) - Worksheets and cheatsheets</li>
                <li>PPTX (.pptx) - Lecture presentation slide decks</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
