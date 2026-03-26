import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import JobOpportunities from "../components/JobOpportunities";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [rejectUser, setRejectUser] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [stats, setStats] = useState({
    students: 0,
    industries: {
      total: 0,
      approved: 0,
      pending: 0,
    },
  });

  const [jobs, setJobs] = useState([]);
  const [list, setList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/api/adminlogin");
    }
  }, [navigate]);

  // LOAD STATS
  useEffect(() => {
    if (tab === "dashboard") {
      api
        .get("/api/admin/stats")
        .then((res) => setStats(res.data.data))
        .catch(console.error);
    }
  }, [tab]);

  // LOAD INDUSTRIES
  useEffect(() => {
    if (tab === "industry") loadIndustries();
  }, [tab]);

  // LOAD JOBS FOR OPPORTUNITIES TAB
  useEffect(() => {
    if (tab === "opportunities") loadJobs();
  }, [tab]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/jobs");
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    loadJobs();
  };

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users");
      const pending = res.data.data.filter(
        (u) => u.role === "industry" && u.status === "pending",
      );
      setList(pending);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, feedbackMsg = "") => {
    try {
      await api.put(`/api/admin/users/${id}/status`, {
        status,
        feedback: feedbackMsg,
      });

      alert(`Industry ${status}`);

      setSelectedUser(null);
      loadIndustries();

      const res = await api.get("/api/admin/stats");
      setStats(res.data.data);
    } catch {
      alert("Action failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/api/adminlogin");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e293b]/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm">A</span>
            AIP <span className="text-indigo-400">Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-widest">Management Suite</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavItem
              active={tab === "dashboard"}
              onClick={() => setTab("dashboard")}
              label="Overview"
              icon="📊"
            />
            <NavItem
              active={tab === "industry"}
              onClick={() => setTab("industry")}
              label="Pending Approvals"
              icon="🛡️"
              badge={stats.industries?.pending}
            />
            <NavItem
              active={tab === "opportunities"}
              onClick={() => setTab("opportunities")}
              label="Job Opportunities"
              icon="💼"
            />
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto group flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-all duration-200"
        >
          <span className="group-hover:translate-x-1 transition-transform">Logout →</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white capitalize">{tab}</h1>
            <p className="text-slate-400 mt-2">Manage and monitor the AIP ecosystem</p>
          </div>
          <div className="text-sm text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
            Admin Session Active
          </div>
        </header>

        {tab === "opportunities" && (
          <div className="bg-[#1e293b]/30 rounded-3xl p-6 border border-white/5 ring-1 ring-white/5">
            <JobOpportunities role="admin" jobs={jobs} refresh={fetchData} />
          </div>
        )}

        {/* DASHBOARD STATS */}
        {tab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard
              title="Total Students"
              value={stats.students}
              icon="👨‍🎓"
              gradient="from-blue-500/20 to-transparent"
              borderColor="border-blue-500/20"
            />
            <StatCard
              title="Total Industries"
              value={stats.industries.total}
              icon="🏭"
              gradient="from-purple-500/20 to-transparent"
              borderColor="border-purple-500/20"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.industries.pending}
              icon="⏳"
              gradient="from-orange-500/20 to-transparent"
              borderColor="border-orange-500/20"
              onClick={() => setTab("industry")}
              highlight={true}
            />
          </div>
        )}

        {/* INDUSTRY LIST */}
        {tab === "industry" && (
          <div className="bg-[#1e293b]/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h3 className="font-semibold text-white">Industry Verification Queue</h3>
            </div>
            {loading ? (
              <div className="p-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Fetching latest applications...</p>
              </div>
            ) : list.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                <span className="text-5xl mb-4">🎉</span>
                <p className="text-slate-400 text-lg">Queue is empty!</p>
                <p className="text-slate-500 text-sm">All industry partners have been processed.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {list.map((u) => (
                  <div
                    key={u._id}
                    className="p-6 flex justify-between items-center hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl">
                        🏢
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{u.name}</p>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium transition-all"
                      >
                        Review Profile
                      </button>
                      <button
                        onClick={() => handleAction(u._id, "approved")}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectUser(u)}
                        className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-sm font-medium transition-all border border-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-[#1e293b] border border-white/10 p-8 rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedUser.name}</h2>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        Industry Partner
                    </span>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white text-2xl">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <DetailBox label="Official Email" value={selectedUser.email} />
              <DetailBox label="Company ID" value={selectedUser.industryDetails?.companyID} />
              <DetailBox label="Entity Type" value={selectedUser.industryDetails?.companyType} />
              <DetailBox label="Website" value={selectedUser.industryDetails?.website} isLink />
              <div className="col-span-2">
                <DetailBox label="Registered Address" value={selectedUser.industryDetails?.address} />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/5">
              <button
                onClick={() => handleAction(selectedUser._id, "approved")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold transition-all"
              >
                Confirm Approval
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setRejectUser(selectedUser);
                }}
                className="flex-1 bg-slate-800 hover:bg-red-600 py-4 rounded-2xl font-bold transition-all"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectUser && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[110] p-6">
          <div className="bg-[#1e293b] p-8 rounded-[2rem] w-full max-w-md border border-red-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Rejection Feedback</h2>
            <p className="text-slate-400 mb-6 text-sm">Please provide a reason. This will be sent to the industry representative.</p>

            <textarea
              placeholder="e.g. Invalid Business Registration Number..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-4 bg-slate-900/50 rounded-2xl border border-white/10 focus:border-red-500/50 focus:ring-0 transition-all text-white placeholder:text-slate-600"
              rows="5"
            />

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  handleAction(rejectUser._id, "rejected", feedback);
                  setRejectUser(null);
                  setFeedback("");
                }}
                className="flex-[2] bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20"
              >
                Submit Rejection
              </button>
              <button
                onClick={() => setRejectUser(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-medium transition-all"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* REFINED SUB-COMPONENTS */

function NavItem({ active, onClick, label, badge, icon }) {
  return (
    <li
      onClick={onClick}
      className={`group cursor-pointer px-4 py-3.5 rounded-2xl flex justify-between items-center transition-all duration-200
      ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg ${active ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`}>{icon}</span>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`${active ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"} px-2 py-0.5 rounded-lg text-[10px] font-black`}>
          {badge}
        </span>
      )}
    </li>
  );
}

function StatCard({ title, value, icon, gradient, borderColor, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      className={`p-8 rounded-[2rem] border ${borderColor} bg-[#1e293b]/50 backdrop-blur-sm cursor-pointer hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}></div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
          <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
        </div>
        <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{icon}</span>
      </div>
      {highlight && value > 0 && (
        <div className="mt-4 flex items-center gap-2 text-orange-400 text-xs font-bold">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Action Required
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value, isLink }) {
  return (
    <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5">
      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-medium break-all">{value || "N/A"}</a>
      ) : (
        <p className="text-white font-medium break-words">{value || "Not Provided"}</p>
      )}
    </div>
  );
}