import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

import MyApplications from "../components/MyApplications";
import MyJobs from "../components/MyJobs";
import PostJob from "../components/PostJobs";
import JobOpportunities from "../components/JobOpportunities";
import StudentApprovals from "../components/StudentApprovals";

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    applicants: 0,
    totalJobs: 0,
  });

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // ===== AUTH CHECK =====
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // ===== MAIN FETCH FUNCTION =====
  const fetchData = async () => {
    setLoading(true);

    try {
      let newStats = {
        total: 0,
        approved: 0,
        pending: 0,
        applicants: 0,
        totalJobs: 0,
      };

      // Public jobs
      const publicJobsRes = await api.get("/jobs");
      setJobs(publicJobsRes.data.data || []);

      // Role-based applications
      const appsRes = await api.get("/applications");
      const apps = appsRes.data.data || [];
      setApplications(apps);

      // ===== STUDENT =====
      if (role === "student") {
        newStats.total = apps.length;
        newStats.approved = apps.filter(a => a.status === "approved").length;
        newStats.pending = apps.filter(a => a.status === "pending").length;
      }

      // ===== INDUSTRY =====
      if (role === "industry") {
        const myJobsRes = await api.get("/jobs/my");
        const myJobsData = myJobsRes.data.data || [];

        setMyJobs(myJobsData);
        newStats.totalJobs = myJobsData.length;

        // Backend already returns only approved applications
        newStats.applicants = apps.length;
        newStats.approved = apps.length;
      }

      // ===== COLLEGE =====
      if (role === "college") {
        newStats.total = apps.length;
        newStats.approved = apps.filter(a => a.status === "approved").length;
        newStats.pending = apps.filter(a => a.status === "pending").length;
      }

      setStats(newStats);

    } catch (err) {

      // Auto logout on token expiry
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error(err);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchData();
  }, [role]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!role) return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl text-blue-500 font-extrabold">AIP Portal</h2>
          <p className="text-slate-400 text-xs mt-1 uppercase">{role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} label="Dashboard" />
          <NavItem active={activeTab === "opportunities"} onClick={() => setActiveTab("opportunities")} label="Job Opportunities" />

          {role === "industry" && (
            <NavItem active={activeTab === "postjobs"} onClick={() => setActiveTab("postjobs")} label="Post New Job" />
          )}

          {role === "student" && (
            <NavItem active={activeTab === "myapplications"} onClick={() => setActiveTab("myapplications")} label="My Applications" />
          )}

          {role === "industry" && (
            <NavItem active={activeTab === "myjobs"} onClick={() => setActiveTab("myjobs")} label="Manage Jobs" />
          )}

          {role === "college" && (
            <NavItem active={activeTab === "studentapprovals"} onClick={() => setActiveTab("studentapprovals")} label="Student Approvals" />
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <p className="text-sm text-white">{name}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600/10 text-red-500 py-2 rounded mt-3"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {loading ? (
          <div className="text-center text-blue-400">Loading...</div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="grid md:grid-cols-3 gap-6">

                {role === "student" && (
                  <>
                    <Card title="Total Applications" value={stats.total} />
                    <Card title="Approved" value={stats.approved} />
                    <Card title="Pending" value={stats.pending} />
                  </>
                )}

                {role === "college" && (
                  <>
                    <Card title="Total Requests" value={stats.total} />
                    <Card title="Approved" value={stats.approved} />
                    <Card title="Pending" value={stats.pending} />
                  </>
                )}

                {role === "industry" && (
                  <>
                    <Card title="Jobs Posted" value={stats.totalJobs} />
                    <Card title="Applicants" value={stats.applicants} />
                    <Card title="Approved Students" value={stats.approved} />
                  </>
                )}

              </div>
            )}

            {activeTab === "studentapprovals" && role === "college" && (
              <StudentApprovals
                applications={applications}
                refreshApplications={fetchData}
              />
            )}

            {role === "industry" && activeTab === "postjobs" && <PostJob refresh={fetchData} />}

            {role === "student" && activeTab === "myapplications" && (
              <MyApplications applications={applications} />
            )}

            {activeTab === "myjobs" && role === "industry" && (
              <MyJobs jobs={myJobs} applications={applications} refresh={fetchData} />
            )}

            {activeTab === "opportunities" && (
              <JobOpportunities role={role} jobs={jobs} refresh={fetchData} />
            )}

          </>
        )}
      </div>
    </div>
  );
}

function NavItem({ active, onClick, label }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer rounded ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-slate-700"
      }`}
    >
      {label}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
      <p className="text-slate-400">{title}</p>
      <p className="text-3xl font-bold">{value || 0}</p>
    </div>
  );
}

export default Dashboard;