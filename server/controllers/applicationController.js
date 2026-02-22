const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student)
const createApplication = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ student: req.user.id, job: req.params.jobId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'Already applied to this job' });
        }

        // Create application. College is implicit (single college system)
        const application = await Application.create({
            student: req.user.id,
            job: req.params.jobId,
            industry: job.industry,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get applications (Role based)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'student') {
            query.student = req.user.id;
        } else if (req.user.role === 'college') {
            // College sees all applications or filtered by status if needed
            // Default: All pending? Or all?
            // User requirement: "Can approve/reject... If reject, give feedback"
            // Let's show all so they can manage them.
        } else if (req.user.role === 'industry') {
            query.industry = req.user.id;
            // Industry sees only college-approved applications
            query.status = { $in: ['approved'] }; // Simplified status
        } else if (req.user.role === 'admin') {
            // Admin sees all
        }

        const applications = await Application.find(query)
            .populate('student', 'name email studentDetails')
            .populate('job', 'title companyName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (College)
const updateApplicationStatus = async (req, res) => {
    const { status, notes } = req.body;

    try {
        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // ONLY COLLEGE can change status in this single-college flow
        // Student applies -> College approves/rejects -> Industry reviews
        if (req.user.role !== 'college') {
            return res.status(403).json({ success: false, message: 'Only college admin can update application status' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Use approved or rejected.' });
        }

        application.status = status;
        if (notes) application.collegeNotes = notes;

        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createApplication,
    getApplications,
    updateApplicationStatus
};
