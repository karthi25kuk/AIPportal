import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");

  const [stats, setStats] = useState({
    students: 0,
    industries: {
      total: 0,
      approved: 0,
      pending: 0
    }
  });

  const [list, setList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/adminlogin");
    }
  }, [navigate]);

  // LOAD STATS
  useEffect(() => {
    if (tab === "dashboard") {
      api.get("/admin/stats")
        .then(res => setStats(res.data.data))
        .catch(console.error);
    }
  }, [tab]);

  // LOAD INDUSTRIES
  useEffect(() => {
    if (tab === "industry") loadIndustries();
  }, [tab]);

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      const pending = res.data.data.filter(
        u => u.role === "industry" && u.status === "pending"
      );
      setList(pending);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      alert(`Industry ${status}`);
      setSelectedUser(null);
      loadIndustries();
      api.get("/admin/stats").then(res => setStats(res.data.data));
    } catch {
      alert("Action failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminlogin");
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">

        <h2 className="text-2xl font-bold text-red-500 mb-2">
          AIP Admin
        </h2>

        <ul className="flex-1 space-y-2">
          <NavItem
            active={tab==="dashboard"}
            onClick={()=>setTab("dashboard")}
            label="Dashboard"
          />

          <NavItem
            active={tab==="industry"}
            onClick={()=>setTab("industry")}
            label="Industry Approvals"
            badge={stats.industries?.pending}
          />
        </ul>

        <button
          onClick={handleLogout}
          className="mt-auto py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8 capitalize">
          {tab} Overview
        </h1>

        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">

            <StatCard
              title="Total Students"
              value={stats.students}
              icon="👨‍🎓"
              color="blue"
            />

            <StatCard
              title="Total Industries"
              value={stats.industries.total}
              icon="🏭"
              color="purple"
            />

            <StatCard
              title="Pending Approvals"
              value={stats.industries.pending}
              icon="⏳"
              color="orange"
              onClick={()=>setTab("industry")}
            />

          </div>
        )}

        {/* INDUSTRY LIST */}
        {tab==="industry" && (
          <div className="bg-slate-800 rounded-xl overflow-hidden">

            {loading ? (
              <div className="p-8 text-center text-slate-500">
                Loading...
              </div>
            ) : list.length===0 ? (
              <div className="p-8 text-center text-slate-500">
                No pending industries
              </div>
            ) : (
              list.map(u=>(
                <div
                  key={u._id}
                  className="p-4 border-b border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-slate-400">{u.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={()=>setSelectedUser(u)}
                      className="px-4 py-2 bg-slate-700 rounded"
                    >
                      Details
                    </button>

                    <button
                      onClick={()=>handleAction(u._id,"approved")}
                      className="px-4 py-2 bg-green-600 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={()=>handleAction(u._id,"rejected")}
                      className="px-4 py-2 bg-red-600 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
        )}

      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-slate-900 p-8 rounded-xl w-full max-w-lg">

            <h2 className="text-xl font-bold mb-4">
              {selectedUser.name}
            </h2>

            <p>Email: {selectedUser.email}</p>
            <p>Address: {selectedUser.industryDetails?.address}</p>
            <p>Website: {selectedUser.industryDetails?.website}</p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={()=>handleAction(selectedUser._id,"approved")}
                className="bg-green-600 px-6 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={()=>handleAction(selectedUser._id,"rejected")}
                className="bg-red-600 px-6 py-2 rounded"
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


/* COMPONENTS */
function NavItem({active,onClick,label,badge}){
  return(
    <li
      onClick={onClick}
      className={`cursor-pointer px-4 py-3 rounded flex justify-between
      ${active?"bg-red-600 text-white":"text-slate-400 hover:bg-slate-700"}`}
    >
      {label}
      {badge>0 && (
        <span className="bg-white text-red-600 px-2 rounded-full text-xs">
          {badge}
        </span>
      )}
    </li>
  )
}

function StatCard({title,value,icon,color,onClick}){
  return(
    <div
      onClick={onClick}
      className="p-6 rounded-xl border bg-slate-800 cursor-pointer"
    >
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <span>{icon}</span>
    </div>
  )
}
