import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function JobOpportunities({ role, jobs = [], refresh }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const [formData, setFormData] = useState({
    tenth: "",
    twelfth: "",
    cgpa: "",
    phone: "",
    resumeLink: "",
  });

  const handleApply = async (jobId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setApplying(true);
    try {
      // ✅ FIXED ENDPOINT to match /api/applications/:jobId
      await api.post(`/api/applications/${jobId}`);
      alert("Applied successfully ✅");
      setSelectedJob(null);
      // Optional: instead of reload, just update UI
      if (refresh) refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setApplying(false);
    }
  };

  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const validJobs = jobs.filter((j) => j && j.title);

  const liveJobs = validJobs.filter(
    (job) => job.status === "open" && !isExpired(job.deadline),
  );

  const expiredJobs = validJobs.filter(
    (job) => job.status === "closed" || isExpired(job.deadline),
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = async () => {
    // ✅ Validation
    if (!formData.tenth || formData.tenth < 0 || formData.tenth > 100) {
      alert("Enter valid 10th percentage (0–100)");
      return;
    }

    if (!formData.twelfth || formData.twelfth < 0 || formData.twelfth > 100) {
      alert("Enter valid 12th percentage (0–100)");
      return;
    }

    if (!formData.cgpa || formData.cgpa < 0 || formData.cgpa > 10) {
      alert("Enter valid CGPA (0–10)");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Enter a valid 10 digit phone number");
      return;
    }

    if (
      !formData.resumeLink ||
      !formData.resumeLink.includes("drive.google.com")
    ) {
      alert("Enter a valid Google Drive resume link");
      return;
    }

    try {
      await api.post(`/applications/${selectedJob._id}`, formData);

      alert("Application submitted successfully ✅");

      setShowApplyForm(false);
      setSelectedJob(null);

      if (refresh) refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Latest <span className="text-blue-500">Opportunities</span>
        </h2>
        <span className="text-slate-400 text-sm">
          {validJobs.length} Jobs found
        </span>
      </div>

      {validJobs.length === 0 && (
        <div className="w-full text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-2xl text-slate-300 font-semibold">
            No Jobs Available
          </h2>
          <p className="text-slate-500 mt-2">
            Check back later for opportunities 🚀
          </p>
        </div>
      )}

      {/* ===== LIVE JOBS ===== */}
      {liveJobs.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-green-400 mb-4">
            Live Opportunities ({liveJobs.length})
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                setSelectedJob={setSelectedJob}
                isExpired={isExpired}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== EXPIRED JOBS ===== */}
      {expiredJobs.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-red-400 mb-4 border-t border-slate-700 pt-6">
            Expired Opportunities ({expiredJobs.length})
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
            {expiredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                setSelectedJob={setSelectedJob}
                isExpired={isExpired}
              />
            ))}
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedJob.title}
            </h2>
            <p className="text-blue-400 text-lg font-medium mb-6">
              {selectedJob.companyName}
            </p>

            <div className="space-y-6 text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">
                    Location
                  </p>
                  <p className="text-white">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">
                    Type
                  </p>
                  <p className="text-white">
                    {selectedJob.type || "Full-time"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">About the Role</h4>
                <p className="leading-relaxed text-slate-400 text-sm">
                  {selectedJob.description}
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Salary</h4>
                <p className="leading-relaxed text-slate-400 text-sm">
                  {selectedJob.salary || "Not specified"} LPA
                </p>
              </div>

              {selectedJob.skills && (
                <div>
                  <h4 className="text-white font-bold mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.departments && (
                <div>
                  <h4 className="text-white font-bold mb-2">
                    Eligible Departments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.departments.map((dept, i) => (
                      <span
                        key={i}
                        className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/20"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-800">
              {role === "student" && (
                <>
                  {selectedJob.status === "closed" ||
                  isExpired(selectedJob.deadline) ? (
                    <div className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold">
                      Not Accepting Registrations
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplyForm(true)}
                      disabled={applying}
                      className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700 text-white"
                    >
                      {applying ? "Applying..." : "Apply Now"}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => setSelectedJob(null)}
                className="bg-slate-700 px-6 py-3 rounded-lg text-white"
              >
                Close
              </button>
            </div>
            {showApplyForm && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-slate-900 p-8 rounded-xl w-[420px] border border-slate-700">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Job Application Form
                  </h2>

                  <div className="space-y-4">
                    <label className="text-slate-400 text-sm">
                      Please provide your 10th % details.
                    </label>
                    <input
                      type="number"
                      name="tenth"
                      placeholder="10th Percentage"
                      value={formData.tenth}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                    <label className="text-slate-400 text-sm">
                      Please provide your 12th % details.
                    </label>
                    <input
                      type="number"
                      name="twelfth"
                      placeholder="12th Percentage"
                      value={formData.twelfth}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                    <label className="text-slate-400 text-sm">
                      Please provide your CGPA details.
                    </label>
                    <input
                      type="number"
                      name="cgpa"
                      placeholder="Current CGPA"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                    <label className="text-slate-400 text-sm">
                      Please provide your phone number for contact purposes.
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                    <label className="text-slate-400 text-sm">
                      Please upload your resume to Google Drive and share the
                      link here. Make sure the link is accessible to anyone with
                      the link.
                    </label>
                    <input
                      type="text"
                      name="resumeLink"
                      placeholder="Google Drive Resume Link"
                      value={formData.resumeLink}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowApplyForm(false)}
                      className="bg-slate-700 px-4 py-2 rounded text-white"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={submitApplication}
                      disabled={applying}
                      className="bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700"
                    >
                      {applying ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
  function JobCard({ job, setSelectedJob, isExpired }) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition shadow-lg hover:border-blue-500/30 flex flex-col group">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition">
              {job.title}
            </h3>

            {isExpired(job.deadline) || job.status === "closed" ? (
              <span className="text-xs px-2 py-1 rounded bg-red-600/10 text-red-500 border border-red-500/20 font-semibold">
                EXPIRED
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded bg-green-600/10 text-green-500 border border-green-500/20 font-semibold">
                LIVE
              </span>
            )}
          </div>

          <p className="text-yellow-400 text-sm font-medium">
            {job.companyName}
          </p>
        </div>

        <div className="flex-1 space-y-2 mb-6 text-sm text-slate-300">
          <p>Location: {job.location || "Remote"}</p>
          <p>Salary: {job.salary || "Not specified"} LPA</p>
          <p>Type: {job.type || "Full-time"}</p>
          <p>
            Deadline:{" "}
            {job.deadline
              ? new Date(job.deadline).toLocaleDateString()
              : "Not specified"}
          </p>
        </div>

        <button
          onClick={() => setSelectedJob(job)}
          className="w-full bg-slate-700 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-medium border border-slate-600 hover:border-blue-500"
        >
          View Details
        </button>
      </div>
    );
  }
}
