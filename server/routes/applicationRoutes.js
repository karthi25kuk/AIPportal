const express = require('express');
const router = express.Router();
const {
    createApplication,
    getApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');


// ================= GET APPLICATIONS =================
// Role-based inside controller
router.get('/', protect, getApplications);


// ================= APPLY FOR JOB =================
router.post('/:jobId', protect, authorize('student'), createApplication);


// ================= COLLEGE APPROVE / REJECT =================
router.put('/:id/status', protect, authorize('college'), updateApplicationStatus);


module.exports = router;