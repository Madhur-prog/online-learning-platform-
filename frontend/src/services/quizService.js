import api from './api';

export const getCourseQuizzes = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/quizzes`);
  return res.data;
};

export const getQuizById = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}`);
  return res.data;
};

export const submitQuiz = async (quizId, answers) => {
  const res = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return res.data;
};

export const getQuizResult = async (attemptId) => {
  const res = await api.get(`/quizzes/attempts/${attemptId}`);
  return res.data;
};

export const createQuiz = async (courseId, quizData) => {
  const res = await api.post(`/courses/${courseId}/quizzes`, quizData);
  return res.data;
};

export const getCourseQuizAttempts = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/quizzes/attempts`);
  return res.data;
};
