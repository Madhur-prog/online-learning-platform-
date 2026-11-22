import api from './api';

export const getCourses = async (category = '', search = '') => {
  const params = {};
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  const res = await api.get('/courses', { params });
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const enrollInCourse = async (courseId) => {
  const res = await api.post(`/courses/${courseId}/enroll`);
  return res.data;
};

export const getEnrolledCourses = async () => {
  const res = await api.get('/courses/my/enrolled');
  return res.data;
};

export const getInstructorCourses = async () => {
  const res = await api.get('/courses/my/teaching');
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await api.post('/courses', courseData);
  return res.data;
};

export const updateCourse = async (id, courseData) => {
  const res = await api.put(`/courses/${id}`, courseData);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

export const updateLessonProgress = async (courseId, lessonId) => {
  const res = await api.post(`/courses/${courseId}/progress`, { lessonId });
  return res.data;
};

export const getLessonById = async (lessonId) => {
  const res = await api.get(`/lessons/${lessonId}`);
  return res.data;
};

export const createLesson = async (courseId, lessonData) => {
  const res = await api.post(`/courses/${courseId}/lessons`, lessonData);
  return res.data;
};

export const getCourseMaterials = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/materials`);
  return res.data;
};

export const uploadStudyMaterial = async (courseId, formData) => {
  const res = await api.post(`/courses/${courseId}/materials`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
