import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // ⭐ new
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data.success) {
        setMessage(res.data.message);
        setMessageType("error");
        return;
      }

      const user = res.data.data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userId", user.id);

      if (user.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {

      const data = err.response?.data;

      // ⭐ INDUSTRY PENDING
      if (data?.status === "pending") {
        setMessage("⏳ Your industry account is under admin approval. Please wait.");
        setMessageType("warning");
      }

      // ⭐ INDUSTRY REJECTED
      else if (data?.status === "rejected") {
        setMessage(
          `❌ Registration rejected. Reason: ${data.feedback || "Contact admin"}`
        );
        setMessageType("error");
      }

      // ⭐ NORMAL ERROR
      else {
        setMessage(
          data?.message || "Login failed. Check credentials."
        );
        setMessageType("error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <nav className="bg-black text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">AIP Portal</h1>
          <Link
            to="/"
            className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 transition"
          >
            Home
          </Link>
        </nav>
      </header>

      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-950 p-10 rounded-lg w-full max-w-md text-center border border-gray-800">

          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            AIP Portal
          </h1>

          <p className="text-slate-300 mb-4">
            Login to your account
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded text-sm font-medium ${
                messageType === "warning"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 outline-none"
              required
            />

            <button
              disabled={loading}
              className={`bg-blue-600 py-3 rounded text-white font-semibold hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-slate-400 mt-4">
            Don’t have an account?
            <Link
              to="/register"
              className="text-blue-500 ml-1 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;