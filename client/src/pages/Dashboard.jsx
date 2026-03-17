import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import MyApplications from "../components/MyApplications";
import MyJobs from "../components/MyJobs";
import PostJob from "../components/PostJobs";
import JobOpportunities from "../components/JobOpportunities";
import StudentApprovals from "../components/StudentApprovals";
import Profile from "../components/Profile";

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
        newStats.approved = apps.filter((a) => a.status === "approved").length;
        newStats.pending = apps.filter((a) => a.status === "pending").length;
      }

      // ===== INDUSTRY =====
      if (role === "industry") {
        const myJobsRes = await api.get("/jobs/my");
        const myJobsData = myJobsRes.data.data || [];

        setMyJobs(myJobsData);
        newStats.totalJobs = myJobsData.length;

        // we now receive all statuses from the backend, so compute approved
        // separately. "applicants" is the total count.
        newStats.applicants = apps.length;
        newStats.approved = apps.filter((a) => a.status === "approved").length;
      }

      // ===== COLLEGE =====
      if (role === "college") {
        newStats.total = apps.length;
        newStats.approved = apps.filter((a) => a.status === "approved").length;
        newStats.pending = apps.filter((a) => a.status === "pending").length;
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

  const jobCharts = myJobs.map((job) => {
    const jobApps = applications.filter((a) => a.job?._id === job._id);

    const approved = jobApps.filter((a) => a.status === "approved").length;
    const pending = jobApps.filter((a) => a.status === "pending").length;
    const rejected = jobApps.filter((a) => a.status === "rejected").length;

    return {
      jobTitle: job.title,
      data: [
        { name: "Approved", value: approved },
        { name: "Pending", value: pending },
        { name: "Rejected", value: rejected },
      ],
    };
  });

  // ===== student chart data =====
  const studentChartData = [
    {
      name: "Approved",
      value: applications.filter((a) => a.status === "approved").length,
    },
    {
      name: "Pending",
      value: applications.filter((a) => a.status === "pending").length,
    },
    {
      name: "Rejected",
      value: applications.filter((a) => a.status === "rejected").length,
    },
  ];

  // ===== college chart data (per job) =====
  const collegeJobCharts = jobs.map((job) => {
    const jobApps = applications.filter((a) => a.job?._id === job._id);
    const approved = jobApps.filter((a) => a.status === "approved").length;
    const pending = jobApps.filter((a) => a.status === "pending").length;
    const rejected = jobApps.filter((a) => a.status === "rejected").length;

    return {
      jobTitle: job.title,
      data: [
        { name: "Approved", value: approved },
        { name: "Pending", value: pending },
        { name: "Rejected", value: rejected },
      ],
    };
  });
  const STATUS_COLORS = {
    Approved: "#10b981", // Emerald 500
    Pending: "#f59e0b", // Amber 500
    Rejected: "#f43f5e", // Rose 500
  };

  // 2. Reusable Chart Card Component
  const AnalyticsCard = ({ title, subtitle, data }) => (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl transition-all hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-400" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
        <div className="bg-slate-900/50 p-2 rounded-lg">
          <TrendingUp size={16} className="text-slate-400" />
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff",
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name] || "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl text-white font-extrabold">AIP <span className="text-blue-500">Portal</span></h2>
          <p className="text-slate-400 text-xs mt-1 uppercase">{role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            label="Dashboard"
          />
          <NavItem
            active={activeTab === "opportunities"}
            onClick={() => setActiveTab("opportunities")}
            label="Job Opportunities"
          />

          {role === "industry" && (
            <NavItem
              active={activeTab === "postjobs"}
              onClick={() => setActiveTab("postjobs")}
              label="Post New Job"
            />
          )}

          {role === "student" && (
            <NavItem
              active={activeTab === "myapplications"}
              onClick={() => setActiveTab("myapplications")}
              label="My Applications"
            />
          )}

          {role === "industry" && (
            <NavItem
              active={activeTab === "myjobs"}
              onClick={() => setActiveTab("myjobs")}
              label="Manage Jobs"
            />
          )}

          {role === "college" && (
            <NavItem
              active={activeTab === "studentapprovals"}
              onClick={() => setActiveTab("studentapprovals")}
              label="Student Approvals"
            />
          )}

          <NavItem
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            label="Profile"
          />
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
              <>
                <h1 className="text-3xl font-semibold text-white mb-6">
                  Welcome,{" "}
                  <span className="font-bold text-blue-500">{name} !</span>
                </h1>

                {/* DASHBOARD CARDS */}
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

                {/* ===== STUDENT CHART ===== */}
                {role === "student" && (
                  <div className="mt-10 max-w-2xl">
                    <AnalyticsCard
                      title="Application Status Overview"
                      subtitle="Your progress at a glance"
                      data={studentChartData}
                    />
                  </div>
                )}

                {/* ===== INDUSTRY CHARTS ===== */}
                {role === "industry" && jobCharts.length > 0 && (
                  <div className="mt-10 grid md:grid-cols-2 gap-6">
                    {jobCharts.map((job, index) => (
                      <AnalyticsCard
                        key={index}
                        title={job.jobTitle}
                        subtitle="Current Hiring Funnel"
                        data={job.data}
                      />
                    ))}
                  </div>
                )}

                {/* ===== COLLEGE CHARTS ===== */}
                {role === "college" && (
                  <div className="mt-10 grid md:grid-cols-2 gap-6">
                    {collegeJobCharts.map((job, index) => (
                      <AnalyticsCard
                        key={index}
                        title={job.jobTitle}
                        subtitle={job.companyName || "Organization Analytics"}
                        data={job.data}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "studentapprovals" && role === "college" && (
              <StudentApprovals
                applications={applications}
                refreshApplications={fetchData}
              />
            )}

            {role === "industry" && activeTab === "postjobs" && (
              <PostJob refresh={fetchData} />
            )}

            {role === "student" && activeTab === "myapplications" && (
              <MyApplications applications={applications} />
            )}

            {activeTab === "myjobs" && role === "industry" && (
              <MyJobs
                jobs={myJobs}
                applications={applications}
                refresh={fetchData}
              />
            )}

            {activeTab === "opportunities" && (
              <JobOpportunities role={role} jobs={jobs} refresh={fetchData} />
            )}

            {activeTab === "profile" && <Profile />}
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
        active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700"
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
