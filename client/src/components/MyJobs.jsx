import { useState } from "react";
import api from "../api/api";

export default function MyJobs({ jobs = [], applications = [], refresh }) {
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Filter applications for a specific job
  const getJobApplicants = (jobId) => {
    return applications.filter((app) => app.job?._id === jobId);
  };

  // ===== REMOVE JOB =====
  const handleStopHiring = async (jobId) => {
    if (!window.confirm("Stop accepting applications for this job?")) return;

    setLoading(true);

    try {
      await api.put(`/jobs/${jobId}/status`, { status: "closed" });

      alert("Hiring stopped for this job.");

      if (refresh) refresh();
    } catch {
      alert("Failed to update job status");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "rejected":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  if (jobs.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
        <h2 className="text-xl font-bold mb-2">My Posted Jobs</h2>
        <p>No jobs posted yet. Use the "Post Jobs" tab to create one.</p>
      </div>
    );

  const isExpired = (job) => {
    if (job.status === "closed") return true;
    if (!job.deadline) return false;
    return new Date(job.deadline) < new Date();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <span className="p-2 bg-blue-600 rounded-lg mr-3 shadow-lg shadow-blue-500/20">
          📋
        </span>{" "}
        Manage Jobs
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
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      {job.title}
                    </h3>

                    {isExpired(job) ? (
                      <span className="text-xs px-2 py-1 rounded bg-red-600/10 text-red-500 border border-red-500/20 font-semibold">
                        EXPIRED
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-green-600/10 text-green-500 border border-green-500/20 font-semibold">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary || "N/A"} LPA</span>
                  </div>
                </div>

                {!isExpired(job) && (
                  <button
                    onClick={() => handleStopHiring(job._id)}
                    disabled={loading}
                    className="mt-4 md:mt-0 bg-red-600/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-medium"
                  >
                    Stop Hiring
                  </button>
                )}
              </div>

              {/* Applicants */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-4 flex items-center">
                  Applicants{" "}
                  <span className="ml-2 bg-slate-700 text-white px-2 py-0.5 rounded-full text-xs">
                    {jobApplicants.length}
                  </span>
                </h4>

                {jobApplicants.length === 0 ? (
                  <p className="text-slate-500 text-sm italic py-2">
                    No approved applicants yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {jobApplicants.map((app) => (
                      <div
                        key={app._id}
                        className="flex justify-between items-center bg-slate-800/80 p-3 rounded border border-slate-700"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {app.student?.name}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {app.student?.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColor(app.status)}`}
                          >
                            {app.status.toUpperCase()}
                          </span>

                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedApplication && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl w-[420px] border border-slate-700 shadow-xl">
                      <h2 className="text-lg font-bold text-white mb-4">
                        Applicant Details
                      </h2>

                      <div className="space-y-2 text-sm text-slate-300">
                        <p>
                          <strong>Name:</strong>{" "}
                          {selectedApplication.student?.name}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {selectedApplication.student?.email}
                        </p>

                        <p>
                          <strong>10th Percentage:</strong>{" "}
                          {selectedApplication.tenth}%
                        </p>

                        <p>
                          <strong>12th Percentage:</strong>{" "}
                          {selectedApplication.twelfth}%
                        </p>

                        <p>
                          <strong>CGPA:</strong> {selectedApplication.cgpa}
                        </p>

                        <p>
                          <strong>Phone:</strong> {selectedApplication.phone}
                        </p>

                        <p>
                          <strong>Resume:</strong>{" "}
                          <a
                            href={selectedApplication.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          >
                            View Resume
                          </a>
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="mt-5 bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
                      >
                        Close
                      </button>
                    </div>
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
