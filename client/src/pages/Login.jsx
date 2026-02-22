import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api/api';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // If backend sends failure
      if (!res.data.success) {
        setMessage(res.data.message);
        setLoading(false);
        return;
      }

      const user = res.data.data;

      // Save everything needed
      localStorage.setItem("token", user.token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userId", user.id);

      // Redirects
      if (user.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-gray-950 p-10 rounded-lg w-full max-w-md text-center border border-gray-800">

        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          AIP portal
        </h1>

        <p className="text-slate-300 mb-4">
          Login to your account
        </p>

        {message && (
          <p className="text-red-500 mb-3 bg-red-900/20 p-2 rounded">
            {message}
          </p>
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
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-slate-400 mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-500 ml-1 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-slate-500 mt-2 text-sm">
          <Link to="/adminlogin" className="hover:text-slate-300">
            Admin Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
