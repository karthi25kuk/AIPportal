import { useState } from "react";
import api from "../api/api";

export default function StudentApprovals({ applications = [], refreshApplications }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter for pending applications or show all with status
  const pendingApps = applications.filter(a => a.status === 'pending');
  const pastApps = applications.filter(a => a.status !== 'pending');

  const handleAction = async (status) => {
    if (!selectedApp) return;
    setLoading(true);

    try {
      await api.put(`/applications/${selectedApp._id}/status`, {
        status: status, // 'approved' or 'rejected'
        notes: feedback
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
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-lg">

      <h2 className="text-2xl font-bold text-white mb-6">
        Student Applications Review
      </h2>

      {applications.length === 0 && (
        <p className="text-slate-400 italic">No applications found from your students yet.</p>
      )}

      <div className="space-y-4">
        {/* Pending Section */}
        {pendingApps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pending Approval ({pendingApps.length})</h3>
            <div className="space-y-4">
              {pendingApps.map((app) => (
                <ApplicationItem key={app._id} app={app} onReview={() => setSelectedApp(app)} statusColor={statusColor} />
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {pastApps.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-slate-400 mb-2">History ({pastApps.length})</h3>
            <div className="space-y-4 opacity-75">
              {pastApps.map((app) => (
                <ApplicationItem key={app._id} app={app} onReview={() => setSelectedApp(app)} statusColor={statusColor} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===== MODAL ===== */}
      {selectedApp && (
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

            <div className="space-y-3 text-slate-300">
              <p><b className="text-white">Student:</b> {selectedApp.student?.name || "Unknown"}</p>
              <p><b className="text-white">Email:</b> {selectedApp.student?.email}</p>
              <p><b className="text-white">Role:</b> {selectedApp.job?.title}</p>
              <p><b className="text-white">Company:</b> {selectedApp.job?.companyName}</p>
              <p><b className="text-white">Current Status:</b> <span className={statusColor(selectedApp.status).split(' ')[0]}>{selectedApp.status.replace(/_/g, ' ')}</span></p>
            </div>

            {/* Feedback */}
            {selectedApp.status === 'pending' && (
              <textarea
                placeholder="Add optional notes for industry..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full mt-6 bg-slate-800 text-white p-3 rounded-lg border border-slate-600 outline-none focus:border-blue-500 transition"
                rows="3"
              />
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">

              {selectedApp.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleAction("approved")}
                    disabled={loading}
                    className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 text-white font-medium transition shadow-lg shadow-green-900/20"
                  >
                    Approve & Forward
                  </button>
                  <button
                    onClick={() => handleAction("rejected")}
                    disabled={loading}
                    className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 text-white font-medium transition shadow-lg shadow-red-900/20"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-500 mr-auto flex items-center">
                  Action already taken.
                </p>
              )}

              <button
                onClick={() => setSelectedApp(null)}
                className="bg-slate-700 px-4 py-2 rounded-lg text-white hover:bg-slate-600 transition"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function ApplicationItem({ app, onReview, statusColor }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-800 transition group cursor-pointer" onClick={onReview}>
      <div>
        <h4 className="text-white font-semibold text-lg group-hover:text-blue-400 transition">
          {app.student?.name} <span className="text-slate-500 text-sm font-normal">applied for</span> {app.job?.title}
        </h4>
        <p className="text-slate-400 text-sm">
          at {app.job?.companyName} • {new Date(app.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-3 md:mt-0 flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(app.status)}`}
        >
          {app.status.replace(/_/g, ' ').toUpperCase()}
        </span>
        <button className="text-blue-400 hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-slate-700 transition">
          Review &rarr;
        </button>
      </div>
    </div>
  )
}
