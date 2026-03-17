import { useState } from "react";
import api from "../api/api";

export default function MyJobs({ jobs = [], applications = [], refresh }) {
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openJobId, setOpenJobId] = useState(null);

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

          const approvedApplicants = jobApplicants.filter(
            (app) => app.status === "approved",
          );

          const pendingApplicants = jobApplicants.filter(
            (app) => app.status === "pending",
          );

          const rejectedApplicants = jobApplicants.filter(
            (app) => app.status === "rejected",
          );

          const isOpen = openJobId === job._id;

          return (
            <div
              key={job._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:border-slate-600 transition"
            >
              {/* Job Header */}
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>

                  <p className="text-sm text-slate-400">
                    📍 {job.location} | 💰 {job.salary || "N/A"} LPA
                  </p>                  
                </div>
                <span
                    className={`inline-block mt-4 text-xs px-3 py-1 rounded-full border ${
                      isExpired(job)
                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                        : "text-green-400 bg-green-500/10 border-green-500/20"
                    }`}
                  >
                    {isExpired(job) ? "Hiring Closed" : "Hiring Active"}
                </span>

                <div className="flex gap-2 mt-2">
                  {/* ⭐ STOP HIRING BUTTON */}
                  {!isExpired(job) && (
                    <button
                      onClick={() => handleStopHiring(job._id)}
                      disabled={loading}
                      className="text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-600/10 text-sm px-4 py-2 rounded shadow-lg shadow-red-900/20"
                    >
                      Stop Hiring
                    </button>
                  )}

                  <button
                    onClick={() => setOpenJobId(isOpen ? null : job._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  >
                    {isOpen ? "Hide Applicants" : "View Applicants"}
                  </button>
                </div>
              </div>

              {/* Applicants Section */}
              {isOpen && (
                <div className="mt-4 space-y-6">
                  {/* Approved Applicants */}
                  <div>
                    <h4 className="text-green-400 font-bold mb-2">
                      Approved Applicants ({approvedApplicants.length})
                    </h4>

                    {approvedApplicants.length === 0 ? (
                      <p className="text-slate-500 text-sm">
                        No approved applicants.
                      </p>
                    ) : (
                      approvedApplicants.map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center bg-slate-900 p-3 rounded mb-2"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {app.student?.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {app.student?.email}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="bg-blue-600 text-xs px-3 py-1 rounded"
                          >
                            Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pending Applicants */}
                  <div>
                    <h4 className="text-orange-400 font-bold mb-2">
                      Pending Applicants ({pendingApplicants.length})
                    </h4>

                    {pendingApplicants.length === 0 ? (
                      <p className="text-slate-500 text-sm">
                        No pending applicants.
                      </p>
                    ) : (
                      pendingApplicants.map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center bg-slate-900 p-3 rounded mb-2"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {app.student?.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {app.student?.email}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="bg-blue-600 text-xs px-3 py-1 rounded"
                          >
                            Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Rejected Applicants */}
                  <div>
                    <h4 className="text-red-400 font-bold mb-2">
                      Rejected Applicants ({rejectedApplicants.length})
                    </h4>

                    {rejectedApplicants.length === 0 ? (
                      <p className="text-slate-500 text-sm">
                        No rejected applicants.
                      </p>
                    ) : (
                      rejectedApplicants.map((app) => (
                        <div
                          key={app._id}
                          className="flex justify-between items-center bg-slate-900 p-3 rounded mb-2"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {app.student?.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {app.student?.email}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="bg-blue-600 text-xs px-3 py-1 rounded"
                          >
                            Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-[420px] border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">
              Applicant Details
            </h2>

            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong>Name:</strong> {selectedApplication.student?.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedApplication.student?.email}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {selectedApplication.student?.studentDetails?.department}
              </p>

              <p>
                <strong>10th Percentage:</strong> {selectedApplication.tenth}%
              </p>

              <p>
                <strong>12th Percentage:</strong> {selectedApplication.twelfth}%
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
  );
}
