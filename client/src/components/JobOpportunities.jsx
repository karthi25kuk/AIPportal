import { useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function JobOpportunities({ role, jobs = [] }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleApply = async (jobId) => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      // ✅ FIXED ENDPOINT to match /api/applications/:jobId
      await api.post(`/applications/${jobId}`);

      alert("Applied successfully ✅");
      setSelectedJob(null);
      // Optional: instead of reload, just update UI
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setApplying(false);
    }
  };

  // ✅ FILTER ONLY VALID + OPEN JOBS
  const validJobs = jobs.filter(
    j => j && j.title && j.status === "open"
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Latest Opportunities</h2>
        <span className="text-slate-400 text-sm">{validJobs.length} Jobs found</span>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validJobs.map((job) => (
          <div
            key={job._id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition shadow-lg hover:border-blue-500/30 flex flex-col group"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition">
                {job.title}
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                {job.companyName || job.industry?.name || "Bannari Amman Institute of Tech Industry"}
              </p>
            </div>

            <div className="flex-1 space-y-2 mb-6">
              <div className="flex items-center text-slate-400 text-sm">
                <span className="mr-2">📍</span> {job.location || "Remote"}
              </div>

              <p className="text-slate-500 text-sm mt-3 line-clamp-3">
                {job.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedJob(job)}
              className="w-full bg-slate-700 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-medium border border-slate-600 hover:border-blue-500"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

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
                  <p className="text-slate-500 text-xs uppercase font-bold">Location</p>
                  <p className="text-white">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Type</p>
                  <p className="text-white">{selectedJob.type || "Full Time"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2">About the Role</h4>
                <p className="leading-relaxed text-slate-400 text-sm">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.skills && (
                <div>
                  <h4 className="text-white font-bold mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <span key={i} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-800">

              {role === "student" && (
                <button
                  onClick={() => handleApply(selectedJob._id)}
                  disabled={applying}
                  className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700 text-white"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}

              <button
                onClick={() => setSelectedJob(null)}
                className="bg-slate-700 px-6 py-3 rounded-lg text-white"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
