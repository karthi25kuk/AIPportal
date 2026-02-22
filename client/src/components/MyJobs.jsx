import { useState } from "react";
import api from "../api/api";

export default function MyJobs({ jobs = [], applications = [] }) {
  const [loading, setLoading] = useState(false);

  // Filter applications for a specific job
  const getJobApplicants = (jobId) => {
    return applications.filter(app => app.job?._id === jobId || app.job === jobId);
  };

  // ===== REMOVE JOB =====
  const handleRemove = async (jobId) => {
    if (!window.confirm("Remove this job post?")) return;
    setLoading(true);

    try {
      await api.delete(`/jobs/${jobId}`);
      alert("Job removed. ✅");
      window.location.reload();
    } catch {
      alert("Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  if (jobs.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
        <h2 className="text-xl font-bold mb-2">My Posted Jobs</h2>
        <p>No jobs posted yet. Use the "Post Jobs" tab to create one.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <span className="p-2 bg-blue-600 rounded-lg mr-3 shadow-lg shadow-blue-500/20">📋</span> Manage Jobs
      </h2>

      <div className="space-y-6">

        {jobs.map((job) => {
          const jobApplicants = getJobApplicants(job._id);

          return (
            <div
              key={job._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:border-slate-600 transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary || 'N/A'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(job._id)}
                  disabled={loading}
                  className="mt-4 md:mt-0 bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-medium"
                >
                  Delete Post
                </button>
              </div>

              {/* Applicants */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-4 flex items-center">
                  Applicants <span className="ml-2 bg-slate-700 text-white px-2 py-0.5 rounded-full text-xs">{jobApplicants.length}</span>
                </h4>

                {jobApplicants.length === 0 ? (
                  <p className="text-slate-500 text-sm italic py-2">
                    No approved applicants yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {jobApplicants.map(app => (
                      <div key={app._id} className="flex justify-between items-center bg-slate-800/80 p-3 rounded border border-slate-700">
                        <div>
                          <p className="text-white font-medium">{app.student?.name}</p>
                          <p className="text-slate-500 text-xs">{app.student?.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
