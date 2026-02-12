import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email,password }
      );

      if(res.data.token){
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("role",res.data.role);
        localStorage.setItem("name",res.data.name);

        navigate("/dashboard");
      }else{
        setMessage(res.data.msg);
      }

    }catch(err){
      setMessage("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-gray-950 p-10 rounded-lg w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          AIP portal
        </h1>

        <p className="text-slate-300 mb-4">
          Login to your account
        </p>

        {message && (
          <p className="text-red-500 mb-3">{message}</p>
        )}

        <form onSubmit={handleSubmit}
          className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className="p-3 rounded bg-slate-700 text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="p-3 rounded bg-slate-700 text-white"
            required
          />

          <button className="bg-blue-600 py-3 rounded text-white">
            Login
          </button>

        </form>

        <p className="text-slate-400 mt-4">
          Don't have an account?
          <Link to="/register" className="text-blue-500 ml-1">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
