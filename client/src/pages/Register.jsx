import api from "../api/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rollNumber, setRollNumber] = useState("");
  const [collegeDept, setCollegeDept] = useState("");

  const [companyId, setCompanyId] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyType, setCompanyType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let payload = { name, email, password, role };

    if (role === "student") {
      payload.studentDetails = {
        rollNumber,
        department: collegeDept,
      };
    }

    if (role === "industry") {
      payload.industryDetails = {
        companyID: companyId,
        website: companyWebsite,
        address: companyAddress,
        companyType: companyType,
      };
    }

    try {
      const res = await api.post("/api/auth/register", payload);

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      if (role === "student") {
        const user = res.data.data;

        localStorage.setItem("token", user.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("userId", user.id);

        navigate("/dashboard");
      }

      if (role === "industry") {
        alert("Registered! Wait for admin approval.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "CSE",
    "IT",
    "AIDS",
    "AIML",
    "CT",
    "CD",
    "CSBS",
    "ECE",
    "EEE",
    "EIE",
    "Mechanical",
    "Mechatronics",
    "Civil",
    "Fashion Tech",
    "Food Tech",
  ];

  const companyTypes = [
    "Product-based",
    "Service-Based",
    "Startup",
    "MNC",
    "Government",
    "Non-Profit",
    "Educational",
  ];

  return (
    <>
      <header className="bg-black/80 backdrop-blur border-b border-gray-800">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold tracking-wide">AIP Portal</h1>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
          >
            Home
          </Link>
        </nav>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden mt-5 mb-5">
          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
            <h2 className="text-4xl font-bold mb-4">Welcome</h2>
            <p className="text-center text-white/80">
              Join the AIP placement ecosystem. Students discover opportunities.
              Industries find talent.
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-400 mb-6">Register to continue</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {/* ROLE SWITCH */}
            <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
              {["student", "industry"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-md capitalize text-sm font-semibold transition ${
                    role === r
                      ? "bg-blue-600 shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                {role === "student" ? "Student Name" : "Industry Name"}
              </label>
              <input
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition"
                required
              />

              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition"
                required
              />

              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition"
                required
              />

              {role === "student" && (
                <>
                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Roll Number
                  </label>
                  <input
                    placeholder="Roll Number"
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    required
                  />

                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Department
                  </label>
                  <select
                    value={collegeDept}
                    onChange={(e) => setCollegeDept(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </>
              )}

              {role === "industry" && (
                <>
                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Company ID
                  </label>
                  <input
                    placeholder="Company ID"
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                  />

                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Company Website Link
                  </label>
                  <input
                    placeholder="Company Website"
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                  />

                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Company Type
                  </label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Company Type</option>
                    {companyTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                    Company Address / Remote
                  </label>
                  <input
                    placeholder="Address / Remote"
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                  />
                </>
              )}

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account?
              <Link to="/login" className="text-blue-400 ml-1 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
