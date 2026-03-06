import api from "../api/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // COMMON
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // STUDENT
  const [rollNumber, setRollNumber] = useState("");
  const [collegeDept, setCollegeDept] = useState("");

  // INDUSTRY
  const [companyId, setCompanyId] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyType, setCompanyType] = useState("");

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let payload = {
      name,
      email,
      password,
      role,
    };

    // STUDENT DATA
    if (role === "student") {
      payload.studentDetails = {
        rollNumber,
        department: collegeDept,
      };
    }

    // INDUSTRY DATA
    if (role === "industry") {
      payload.industryDetails = {
        companyID: companyId,
        website: companyWebsite,
        address: companyAddress,
        companyType: companyType,
      };
    }

    try {
      const res = await api.post("/auth/register", payload);

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      // STUDENT → AUTO LOGIN
      if (role === "student") {
        const user = res.data.data;

        localStorage.setItem("token", user.token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("userId", user.id);

        navigate("/dashboard");
      }

      // INDUSTRY → WAIT APPROVAL
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
    <header>
          <nav className="bg-black text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">AIP Portal</h1>
            <div>
              <Link to="/" className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 transition">
                Home
              </Link>
            </div>
          </nav>
        </header>
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-950 p-8 rounded-lg w-full max-w-md text-center border border-gray-800">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">AIP Portal</h1>

        <p className="text-slate-300 mb-6">Create your account</p>

        {error && (
          <p className="text-red-500 mb-4 bg-red-900/20 p-2 rounded">{error}</p>
        )}

        {/* ROLE BUTTONS */}
        <div className="flex gap-2 mb-6 justify-center">
          {["student", "industry"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded capitalize text-sm font-medium transition ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* COMMON */}
          <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
            Name
          </label>
          <input
            placeholder="EnterName"
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
            required
          />

          <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="EnterEmail"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
            required
          />

          <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="EnterPassword"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
            required
          />

          {/* STUDENT */}
          {role === "student" && (
            <>
              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Roll Number
              </label>
              <input
                placeholder="Enter Roll Number"
                onChange={(e) => setRollNumber(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
                required
              />

              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Select Department
              </label>
              <select
                value={collegeDept}
                onChange={(e) => setCollegeDept(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>

                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* INDUSTRY */}
          {role === "industry" && (
            <>
              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Company ID
              </label>
              <input
                placeholder="Enter Company ID"
                onChange={(e) => setCompanyId(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
              />

              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Company Website Link
              </label>
              <input
                placeholder="Enter Company Website Link"
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
              />

              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Select Company Type
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Company Type</option>

                {companyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="text-left text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Address
              </label>
              <input
                placeholder="Enter Address If Multiple,put Remote"
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="p-3 rounded bg-slate-700 text-white border border-slate-600 outline-none focus:border-blue-500"
              />
            </>
          )}

          <button
            disabled={loading}
            className={`bg-blue-600 py-3 rounded text-white font-semibold mt-3 hover:bg-blue-700 transition ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-slate-400 mt-4">
          Already have account?
          <Link to="/login" className="text-blue-500 ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
