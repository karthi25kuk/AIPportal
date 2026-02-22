import { useState } from "react";
import api from "../api/api";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    salary: "",
    website: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = form.skills.split(",").map(s => s.trim());

      await api.post("/jobs", {
        title: form.title,
        description: form.description,
        skills: skillsArray,
        salary: form.salary,
        type: "Full Time", // Could be a form field
        // website: form.website, // Not directly supported by schema, maybe include in description or add to model
        // My Job model didn't have website, but I can add it or just ignore. 
        // For now I'll ignore 'website' or embed it in description.
        // Actually, let's just send what we have, if not in schema it's ignored.
        location: form.location,
        // companyName: auto-filled by backend from user details
      });

      alert("Job Posted Successfully! 🚀");

      setForm({
        title: "",
        description: "",
        skills: "",
        salary: "",
        website: "",
        location: ""
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 max-w-4xl mx-auto">

      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-0"></div>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center relative z-10">
          <span className="bg-blue-600 p-2 rounded-lg mr-3 shadow-lg shadow-blue-500/30">💼</span> Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">

          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Role */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Job Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600"
                required
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Skills Required
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600"
                required
              />
              <span className="text-xs text-slate-500 ml-1">
                Comma separated values
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              placeholder="Detailed explanation of the role, responsibilities, and requirements..."
              className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600 resize-none"
              required
            />
          </div>

          {/* Salary + Location Row */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Salary (Optional)
              </label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 12 LPA"
                className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Remote"
                className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600"
                required
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Posting Job...' : 'Publish Job Post'}
          </button>

        </form>
      </div>
    </div>
  );
}
