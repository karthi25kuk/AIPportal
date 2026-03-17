import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../api/api';

function AdminLogin() { 
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
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative bg-[#1e293b]/40 backdrop-blur-2xl p-10 md:p-14 rounded-[2.5rem] w-full max-w-lg border border-white/5 shadow-2xl ring-1 ring-white/10">
                
                {/* LOGO AREA */}
                <div className="mb-10 text-center">
                    
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        AIP Portal <span className="text-indigo-400">Admin</span>
                    </h1>
                    <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-xs">
                        Secure Gateway
                    </p>
                </div>

                {message && (
                    <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm font-semibold tracking-wide">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group relative">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-4 group-focus-within:text-indigo-400 transition-colors">
                            Admin Credentials
                        </label>
                        <input
                            type="email"
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-[#0f172a]/50 text-white border border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                            required
                        />
                    </div>

                    <div className="group relative">
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-[#0f172a]/50 text-white border border-white/5 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600 font-medium"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full group relative flex items-center justify-center gap-3 bg-indigo-600 py-5 rounded-2xl text-white font-bold text-lg hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-950/50 overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                    >
                        {/* BUTTON SHIMMER EFFECT */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Authorizing...</span>
                            </>
                        ) : (
                            <span>Enter Dashboard</span>
                        )}
                    </button>
                </form>

                <div className="mt-5 pt-8 border-t border-white/5 text-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-slate-500 text-sm font-semibold hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Back to User Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;