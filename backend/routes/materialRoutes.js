const express = require('express');
const router = express.Router();
const { downloadMaterial, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/:id/download', protect, downloadMaterial);
router.delete('/:id', protect, authorize('instructor'), deleteMaterial);

module.exports = router;
