import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Register() {

  const [role,setRole] = useState("student");
  const [colleges,setColleges] = useState("");

  // COMMON
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  // STUDENT
  const [rollNumber,setRollNumber] = useState("");
  const [collegeName,setCollegeName] = useState("");

  // COLLEGE
  const [collegeId,setCollegeId] = useState("");
  const [collegeWebsite,setCollegeWebsite] = useState("");
  const [collegeAddress,setCollegeAddress] = useState("");

  // INDUSTRY
  const [companyId,setCompanyId] = useState("");
  const [companyWebsite,setCompanyWebsite] = useState("");
  const [companyAddress,setCompanyAddress] = useState("");

  // SUBMIT
  const handleSubmit = async(e)=>{
    e.preventDefault();

    let data = { name,email,password,role };

    if(role==="student"){
      data.rollNumber = rollNumber;
      data.collegeName = collegeName;
    }

    if(role==="college"){
      data.collegeId = collegeId;
      data.collegeWebsite = collegeWebsite;
      data.collegeAddress = collegeAddress;
    }

    if(role==="industry"){
      data.companyId = companyId;
      data.companyWebsite = companyWebsite;
      data.companyAddress = companyAddress;
    }

    await axios.post("http://localhost:5000/api/auth/register",data);
    alert("Registered! Wait for approval");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-gray-950 p-8 rounded-lg w-full max-w-md text-center">

        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          AIP Portal
        </h1>

        <p className="text-slate-300 mb-6">
          Create your account
        </p>

        {/* ROLE BUTTONS */}
        <div className="flex gap-3 mb-6 justify-center">
          {["student","college","industry"].map(r=>(
            <button key={r}
              onClick={()=>setRole(r)}
              className={`px-4 py-2 rounded ${
                role===r?"bg-blue-600 text-white":"bg-gray-300"
              }`}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* COMMON */}
          <input placeholder="Name"
            onChange={e=>setName(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"/>

          <input type="email" placeholder="Email"
            onChange={e=>setEmail(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"/>

          <input type="password" placeholder="Password"
            onChange={e=>setPassword(e.target.value)}
            className="p-2 rounded bg-slate-700 text-white"/>

          {/* STUDENT */}
          {role==="student" && (
            <>
              <input placeholder="Roll Number"
                onChange={e=>setRollNumber(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>
              
              <input placeholder="College Name"
                onChange={e=>setCollegeName(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>
              
            </>
          )}

          {/* COLLEGE */}
          {role==="college" && (
            <>
              <input placeholder="College ID"
                onChange={e=>setCollegeId(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>

              <input placeholder="Website"
                onChange={e=>setCollegeWebsite(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>

              <input placeholder="Address"
                onChange={e=>setCollegeAddress(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>
            </>
          )}

          {/* INDUSTRY */}
          {role==="industry" && (
            <>
              <input placeholder="Company ID"
                onChange={e=>setCompanyId(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>

              <input placeholder="Website"
                onChange={e=>setCompanyWebsite(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>

              <input placeholder="Address"
                onChange={e=>setCompanyAddress(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>
            </>
          )}

          <button className="bg-blue-600 py-2 rounded text-white mt-3">
            Register
          </button>

        </form>

        <p className="text-slate-400 mt-4">
          Already have account?
          <Link to="/login" className="text-blue-500 ml-1">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
