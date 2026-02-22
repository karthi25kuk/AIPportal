const express = require('express');
const router = express.Router();
const { createApplication, getApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all applications (or specific role based on token)
router.get('/', protect, getApplications);
router.get('/my', protect, getApplications);
router.get('/industry', protect, authorize('industry'), getApplications);
router.get('/college', protect, authorize('college'), getApplications);

// Apply for a job
router.post('/:jobId', protect, authorize('student'), createApplication);

// Update status (College only)
router.put('/:id/status', protect, authorize('college'), updateApplicationStatus);

module.exports = router;
