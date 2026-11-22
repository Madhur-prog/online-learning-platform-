import api from './api';

export const getCourseDiscussions = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/discussions`);
  return res.data;
};

export const createDiscussion = async (courseId, { title, content }) => {
  const res = await api.post(`/courses/${courseId}/discussions`, { title, content });
  return res.data;
};

export const getDiscussionReplies = async (discussionId) => {
  const res = await api.get(`/discussions/${discussionId}/replies`);
  return res.data;
};

export const createReply = async (discussionId, content) => {
  const res = await api.post(`/discussions/${discussionId}/replies`, { content });
  return res.data;
};

export const deleteDiscussion = async (discussionId) => {
  const res = await api.delete(`/discussions/${discussionId}`);
  return res.data;
};
