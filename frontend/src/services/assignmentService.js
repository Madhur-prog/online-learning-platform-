import api from './api';

export const getCourseAssignments = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/assignments`);
  return res.data;
};

export const getAssignmentById = async (assignmentId) => {
  const res = await api.get(`/assignments/${assignmentId}`);
  return res.data;
};

export const submitAssignment = async (assignmentId, formData) => {
  const res = await api.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getAssignmentStatus = async (assignmentId) => {
  const res = await api.get(`/assignments/${assignmentId}/status`);
  return res.data;
};

export const createAssignment = async (courseId, assignmentData) => {
  const res = await api.post(`/courses/${courseId}/assignments`, assignmentData);
  return res.data;
};

export const getAssignmentSubmissions = async (assignmentId) => {
  const res = await api.get(`/assignments/${assignmentId}/submissions`);
  return res.data;
};

export const gradeSubmission = async (submissionId, gradeData) => {
  const res = await api.put(`/submissions/${submissionId}/grade`, gradeData);
  return res.data;
};
