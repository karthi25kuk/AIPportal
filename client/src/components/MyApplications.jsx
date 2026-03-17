import {
  FileText,
  Building2,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  X,
  Phone,
  GraduationCap,
  ExternalLink,
  Briefcase
} from "lucide-react";
import { useState } from "react";

export default function MyApplications({ applications = [] }) {
  const [selectedApp, setSelectedApp] = useState(null);

  const getStatusDetails = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          icon: <CheckCircle2 size={14} />,
          label: "Approved",
        };
      case "rejected":
        return {
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          icon: <XCircle size={14} />,
          label: "Rejected",
        };
      default:
        return {
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          icon: <Clock size={14} />,
          label: "Pending",
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
              <FileText size={24} />
            </div>
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1 tracking-wide">Track your placement journey</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 px-4 py-1.5 rounded-full text-slate-300 text-sm font-medium">
          Total: {applications.length}
        </div>
      </div>

      {/* LIST */}
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl">
          <FileText size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 font-medium">No applications found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => {
            const status = getStatusDetails(app.status);
            return (
              <div
                key={app._id}
                className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-indigo-500/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {app.job?.title}
                    </h2>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-600" />
                        {app.job?.companyName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-600" />
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-[11px] border rounded-full font-bold uppercase tracking-wider ${status.color}`}>
                      {status.icon} {status.label}
                    </span>

                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      View Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {app.feedback && (
                  <div className="mt-4 pt-4 border-t border-slate-800/50 flex gap-2 items-start text-sm text-slate-400 italic">
                    <MessageSquare size={14} className="mt-0.5 text-indigo-500" />
                    <p>Coordinator: "{app.feedback}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedApp(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="text-indigo-500" size={20} />
                Application Overview
              </h2>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Summary */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-400">{selectedApp.job?.title}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                   at {selectedApp.job?.companyName}
                </p>
              </div>

              {/* Grid Data */}
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Contact Number" value={selectedApp.phone} icon={<Phone size={14}/>} />
                <DetailItem label="Current CGPA" value={selectedApp.cgpa} icon={<GraduationCap size={14}/>} />
                <DetailItem label="10th Percentage" value={`${selectedApp.tenth}%`} />
                <DetailItem label="12th Percentage" value={`${selectedApp.twelfth}%`} />
              </div>

              {/* Resume Section */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Documents</p>
                <a
                  href={selectedApp.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={18} />
                  View Submitted Resume
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-800/30 p-4 text-center">
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Component for Modal Items */
function DetailItem({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-slate-200 font-medium">{value || "N/A"}</p>
    </div>
  );
}