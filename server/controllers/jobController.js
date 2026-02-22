const Job = require('../models/Job');


// ================= GET ALL JOBS (PUBLIC) =================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('industry', 'name industryDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ================= GET SINGLE JOB =================
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('industry', 'name industryDetails');

    if (!job)
      return res.status(404).json({ success: false, message: 'Job not found' });

    res.json({ success: true, data: job });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ================= CREATE JOB =================
const createJob = async (req, res) => {
  try {

    // 🔒 Role Check
    if (req.user.role !== "industry")
      return res.status(403).json({ message: "Only industry can create jobs" });

    // 🔒 Approval Check
    if (req.user.status !== "approved")
      return res.status(403).json({ message: "Industry not approved yet" });

    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      skills: req.body.skills,
      salary: req.body.salary,
      type: req.body.type,
      location: req.body.location,

      industry: req.user.id,  // always from token
      companyName: req.user.industryDetails?.companyName || req.user.name
    });

    res.status(201).json({ success: true, data: job });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ================= UPDATE JOB =================
const updateJob = async (req, res) => {
  try {

    if (req.user.role !== "industry")
      return res.status(403).json({ message: "Only industry can update jobs" });

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.industry.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // 🔒 Prevent protected field update
    const allowedFields = ["title", "description", "skills", "salary", "type", "location", "status"];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ================= DELETE JOB =================
const deleteJob = async (req, res) => {
  try {

    if (req.user.role !== "industry")
      return res.status(403).json({ message: "Only industry can delete jobs" });

    const job = await Job.findById(req.params.id);

    if (!job)
      return res.status(404).json({ message: "Job not found" });

    if (job.industry.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ================= MY JOBS =================
const getMyJobs = async (req, res) => {
  try {

    if (req.user.role !== "industry")
      return res.status(403).json({ message: "Only industry can view their jobs" });

    const jobs = await Job.find({ industry: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};