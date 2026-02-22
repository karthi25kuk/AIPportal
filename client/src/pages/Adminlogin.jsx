import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api/api';

function AdminLogin() { // Renamed to AdminLogin standard naming

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
            const res = await api.post(
                "/auth/login",
                { email, password }
            );

            if (res.data.success) {
                const { role, token, name } = res.data.data;

                if (role !== 'admin') {
                    setMessage("Access Denied: Not an Admin account");
                    setLoading(false);
                    return;
                }

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("name", name);

                navigate("/admindashboard");
            } else {
                setMessage(res.data.message || "Login failed");
            }

        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Login failed check credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">

            <div className="bg-gray-950 p-10 rounded-lg w-full max-w-md text-center border border-gray-800">

                <h1 className="text-3xl font-bold text-red-600 mb-2">
                    AIP Portal Admin
                </h1>

                <p className="text-slate-300 mb-4">
                    Restricted Access
                </p>

                {message && (
                    <p className="text-red-500 mb-3 bg-red-900/20 p-2 rounded">{message}</p>
                )}

                <form onSubmit={handleSubmit}
                    className="flex flex-col gap-4">

                    <input
                        type="email" // Changed from text to email for consistency
                        placeholder="Admin Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-red-500 outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-red-500 outline-none"
                        required
                    />

                    <button
                        disabled={loading}
                        className={`bg-red-600 py-3 rounded text-white font-semibold hover:bg-red-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {loading ? 'Authenticating...' : 'Admin Login'}
                    </button>

                </form>

                <p className="text-slate-500 mt-4 text-sm hover:text-slate-400 cursor-pointer" onClick={() => navigate('/login')}>
                    Back to User Login
                </p>

            </div>
        </div>
    );
}

export default AdminLogin;