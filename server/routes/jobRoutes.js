const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('industry'), createJob);

router.get("/my", protect, authorize("industry"), getMyJobs);

router.route('/:id')
    .get(getJob)
    .put(protect, authorize('industry'), updateJob)
    .delete(protect, authorize('industry'), deleteJob);

module.exports = router;
