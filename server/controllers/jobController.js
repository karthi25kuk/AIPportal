const Job = require('../models/Job');


// ================= GET ALL JOBS =================
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
    const job = await Job.create({
      ...req.body,
      industry: req.user.id,
      companyName: req.user.industryDetails?.companyName || req.user.name
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ================= UPDATE JOB =================
const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job)
    return res.status(404).json({ message: "Job not found" });

  if (job.industry.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  const updated = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: updated });
};


// ================= DELETE JOB =================
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job)
    return res.status(404).json({ message: "Job not found" });

  if (job.industry.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  await job.deleteOne();

  res.json({ success: true, message: "Job deleted" });
};


// ================= MY JOBS =================
const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ industry: req.user.id });

  res.json({ success: true, data: jobs });
};


// ================= EXPORT =================
module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};
