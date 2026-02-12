import { useState,useEffect } from "react";
import axios from "axios";

export default function AdminDashboard(){

  const [tab,setTab] = useState("dashboard");
  const [stats,setStats] = useState({});
  const [list,setList] = useState([]);
  const [selected,setSelected] = useState(null);

  // LOAD STATS
  useEffect(()=>{
    axios.get("http://localhost:5000/api/auth/admin/stats")
      .then(res=>setStats(res.data));
  },[]);

  // LOAD LIST
  const loadList = (type)=>{
    axios.get(`http://localhost:5000/api/auth/pending/${type}`)
      .then(res=>setList(res.data));
  };

  const approve = async(id)=>{
    await axios.put(`http://localhost:5000/api/auth/approve/${id}`);
    loadList(tab);
  };

  const reject = async(id)=>{
    await axios.delete(`http://localhost:5000/api/auth/reject/${id}`);
    loadList(tab);
  };

  const Card = ({title,data})=>(
    <div className="bg-slate-800 p-6 rounded text-white">
      <h3 className="text-xl mb-2">{title}</h3>
      <p>Total: {data?.total}</p>
      <p className="text-green-400">Approved: {data?.approved}</p>
      <p className="text-yellow-400">Pending: {data?.pending}</p>
    </div>
  );

  return(
    <div className="flex min-h-screen bg-slate-900">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-800 p-6 text-white flex flex-col">
        <h2 className="text-2xl font-bold text-blue-500 mb-8">Admin</h2>

        <ul className="space-y-3">
          <li onClick={()=>setTab("dashboard")} className="cursor-pointer mt-2">Dashboard</li>

          <li onClick={()=>{setTab("colleges");loadList("colleges");}}
            className="cursor-pointer mt-2">
            College Approval
          </li>

          <li onClick={()=>{setTab("industry");loadList("industry");}}
            className="cursor-pointer mt-4">
            Industry Approval
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <Card title="Students" data={stats.students}/>
            <Card title="Colleges" data={stats.colleges}/>
            <Card title="Industry" data={stats.industry}/>
          </div>
        )}

        {/* APPROVAL LIST */}
        {(tab==="colleges" || tab==="industry") && (
          <>
            <h1 className="text-2xl text-white mb-6">
              Pending {tab}
            </h1>

            {list.map(u=>(
              <div key={u._id}
                className="bg-slate-800 p-4 mb-3 flex justify-between text-white">

                <div>
                  <p>{u.name}</p>
                  <p>{u.email}</p>
                  <p>{u.collegeAddress || u.companyAddress}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={()=>setSelected(u)}
                    className="bg-blue-600 px-3">
                    Details
                  </button>

                  <button
                    onClick={()=>approve(u._id)}
                    className="bg-green-600 px-3">
                    Approve
                  </button>

                  <button
                    onClick={()=>reject(u._id)}
                    className="bg-red-600 px-3">
                    Reject
                  </button>
                </div>

              </div>
            ))}
          </>
        )}

      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-xl mb-3">{selected.name}</h2>
            <p>Email: {selected.email}</p>
            <p>ID: {selected.collegeId || selected.companyId}</p>
            <p>Website: {selected.collegeWebsite || selected.companyWebsite}</p>
            <p>Address: {selected.collegeAddress || selected.companyAddress}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={()=>approve(selected._id)}
                className="bg-green-600 text-white px-4 py-2">
                Approve
              </button>

              <button
                onClick={()=>reject(selected._id)}
                className="bg-red-600 text-white px-4 py-2">
                Reject
              </button>

              <button
                onClick={()=>setSelected(null)}
                className="bg-gray-500 text-white px-4 py-2">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
