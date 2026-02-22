const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');


// ================= APPLY FOR JOB =================
const createApplication = async (req, res) => {
    try {

        if (req.user.role !== "student")
            return res.status(403).json({ success: false, message: "Only students can apply" });

        const job = await Job.findById(req.params.jobId);

        if (!job || job.status !== "open") {
            return res.status(404).json({ success: false, message: 'Job not found or closed' });
        }

        const existingApplication = await Application.findOne({
            student: req.user.id,
            job: req.params.jobId
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'Already applied to this job' });
        }

        const application = await Application.create({
            student: req.user.id,
            job: req.params.jobId,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: application
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// ================= GET APPLICATIONS (ROLE BASED) =================
const getApplications = async (req, res) => {
    try {

        let applications;

        // STUDENT → only their applications
        if (req.user.role === 'student') {

            applications = await Application.find({ student: req.user.id })
                .populate('job', 'title companyName status')
                .sort({ appliedDate: -1 });

        }

        // COLLEGE → all applications
        else if (req.user.role === 'college') {

            applications = await Application.find()
                .populate('student', 'name email studentDetails')
                .populate('job', 'title companyName')
                .sort({ appliedDate: -1 });

        }

        // INDUSTRY → only approved applications for their jobs
        else if (req.user.role === 'industry') {

            const jobs = await Job.find({ industry: req.user.id });
            const jobIds = jobs.map(job => job._id);

            applications = await Application.find({
                job: { $in: jobIds },
                status: 'approved'
            })
                .populate('student', 'name email studentDetails')
                .populate('job', 'title companyName')
                .sort({ appliedDate: -1 });

        }

        // ADMIN → all
        else if (req.user.role === 'admin') {

            applications = await Application.find()
                .populate('student', 'name email')
                .populate('job', 'title companyName')
                .sort({ appliedDate: -1 });

        }

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// ================= COLLEGE APPROVE / REJECT =================
const updateApplicationStatus = async (req, res) => {
    try {

        if (req.user.role !== 'college')
            return res.status(403).json({ success: false, message: 'Only college can update application status' });

        const { status, feedback } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be approved or rejected'
            });
        }

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Prevent re-processing
        if (application.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Application already processed'
            });
        }

        application.status = status;

        if (status === 'rejected' && feedback) {
            application.feedback = feedback;
        }

        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


module.exports = {
    createApplication,
    getApplications,
    updateApplicationStatus
};