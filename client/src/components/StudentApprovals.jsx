import { useState, useMemo } from "react";
import api from "../api/api";

export default function StudentApprovals({
  applications = [],
  refreshApplications,
}) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ NEW FILTER STATE
  const [selectedIndustry, setSelectedIndustry] = useState("");

  // ⭐ GET UNIQUE INDUSTRIES FROM APPLICATIONS
  const industries = useMemo(() => {
    const set = new Set();
    applications.forEach((a) => {
      if (a.job?.companyName) set.add(a.job.companyName);
    });
    return Array.from(set);
  }, [applications]);

  // ⭐ FILTERED APPLICATIONS
  const filteredApplications = useMemo(() => {
    if (!selectedIndustry) return applications;
    return applications.filter(
      (a) => a.job?.companyName === selectedIndustry
    );
  }, [applications, selectedIndustry]);

  const pendingApps = filteredApplications.filter(
    (a) => a.status === "pending"
  );
  const pastApps = filteredApplications.filter(
    (a) => a.status !== "pending"
  );

  const handleAction = async (status) => {
    if (!selectedApp) return;
    setLoading(true);

    try {
      await api.put(`/applications/${selectedApp._id}/status`, {
        status: status,
        feedback: feedback,
      });

      alert("Updated successfully ✅");
      setSelectedApp(null);
      setFeedback("");
      if (refreshApplications) refreshApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-600/10 text-green-500 border border-green-500/20";
      case "rejected":
        return "bg-red-600/10 text-red-500 border border-red-500/20";
      case "pending":
        return "bg-yellow-600/10 text-yellow-500 border border-yellow-500/20";
      default:
        return "text-slate-400 bg-slate-400/20 border-slate-400/20";
    }
  };

  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-2xl font-bold text-white mb-6">
        Student <span className="text-blue-500">Applications Review</span>
      </h2>

      {/* ⭐ INDUSTRY FILTER */}
<div>
      <p className="text-zinc-400 ml-1 mb-1">Filter by</p>
      <div className="mb-6">
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="bg-slate-900 text-white p-3 rounded-lg border border-slate-600 outline-none"
        >
          <option value="">All Industries</option>

          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>
</div>
      </div>

      {filteredApplications.length === 0 && (
        <p className="text-slate-400 italic">
          No applications found for selected industry.
        </p>
      )}

      <div className="space-y-4">
        {pendingApps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              Pending Approval ({pendingApps.length})
            </h3>
            <div className="space-y-4">
              {pendingApps.map((app) => (
                <ApplicationItem
                  key={app._id}
                  app={app}
                  onReview={() => setSelectedApp(app)}
                  statusColor={statusColor}
                />
              ))}
            </div>
          </div>
        )}

        {pastApps.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              History ({pastApps.length})
            </h3>
            <div className="space-y-4 opacity-75">
              {pastApps.map((app) => (
                <ApplicationItem
                  key={app._id}
                  app={app}
                  onReview={() => setSelectedApp(app)}
                  statusColor={statusColor}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL (unchanged) ===== */}
      {selectedApp && (
        <ModalView
          selectedApp={selectedApp}
          setSelectedApp={setSelectedApp}
          feedback={feedback}
          setFeedback={setFeedback}
          handleAction={handleAction}
          loading={loading}
          statusColor={statusColor}
        />
      )}
    </div>
  );
}

/* ⭐ extracted modal (NO LOGIC CHANGE) */
function ModalView({
  selectedApp,
  setSelectedApp,
  feedback,
  setFeedback,
  handleAction,
  loading,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-xl p-8 border border-slate-600 shadow-2xl relative">
        <button
          onClick={() => setSelectedApp(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">
          Review Application
        </h2>

        <div className="space-y-2 text-slate-300">
          <p><b>Student:</b> {selectedApp.student?.name}</p>
          <p><b>Email:</b> {selectedApp.student?.email}</p>
          <p><b>Role:</b> {selectedApp.job?.title}</p>
          <p><b>Company:</b> {selectedApp.job?.companyName}</p>
          <p><b>Roll Number:</b> {selectedApp.student?.studentDetails?.rollNumber || "Unknown"}</p>
          <p><b>Department:</b> {selectedApp.student?.studentDetails?.department || "Unknown"}</p>
          <p><b>10th Percentage:</b> {selectedApp.tenth || "N/A"} %</p>
          <p><b>12th Percentage:</b> {selectedApp.twelfth || "N/A"} %</p>
          <p><b>CGPA:</b> {selectedApp.cgpa || "N/A"}</p>
          <p><b>Phone:</b> {selectedApp.phone || "N/A"}</p>
          <p><b>Resume:</b>
                {selectedApp.resumeLink ? (
                  <a
                    href={selectedApp.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "N/A"
                )}
          </p>
        </div>

        {selectedApp.status === "pending" && (
          <textarea
            placeholder="Feedback if rejected..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full mt-4 bg-slate-800 p-3 rounded border border-slate-600"
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          {selectedApp.status === "pending" && (
            <>
              <button
                onClick={() => handleAction("approved")}
                className="bg-green-600 px-5 py-2 rounded text-white"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction("rejected")}
                className="bg-red-600 px-5 py-2 rounded text-white"
              >
                Reject
              </button>
            </>
          )}

          <button
            onClick={() => setSelectedApp(null)}
            className="bg-slate-700 px-4 py-2 rounded text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationItem({ app, onReview, statusColor }) {
  return (
    <div
      className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800"
      onClick={onReview}
    >
      <div>
        <h4 className="text-white font-semibold">
          {app.student?.name} → {app.job?.title}
        </h4>
        <p className="text-yellow-200 text-sm">
          {app.job?.companyName}
        </p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs border ${statusColor(
          app.status
        )}`}
      >
        {app.status.toUpperCase()}
      </span>
    </div>
  );
}
