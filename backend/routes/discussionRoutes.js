const express = require('express');
const router = express.Router();
const {
  getDiscussionReplies,
  createReply,
  deleteDiscussion
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.get('/:id/replies', protect, getDiscussionReplies);
router.post('/:id/replies', protect, createReply);
router.delete('/:id', protect, deleteDiscussion);

module.exports = router;
