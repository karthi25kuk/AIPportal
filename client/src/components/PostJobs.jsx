import { useState } from "react";
import api from "../api/api";

export default function PostJob({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    salary: "",
    website: "",
    location: "",
    departments: [],
    type: "Full-time",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date();
    const selected = new Date(form.deadline);

    if (selected < today) {
      alert("Deadline cannot be in the past");
      setLoading(false);
      return;
    }

    try {
      const skillsArray = form.skills.split(",").map((s) => s.trim());

      await api.post("/api/jobs", {
        title: form.title,
        description: form.description,
        skills: skillsArray,
        salary: form.salary ? Number(form.salary) : undefined,
        type: form.type, // Could be a form field
        // website: form.website, // Not directly supported by schema, maybe include in description or add to model
        // My Job model didn't have website, but I can add it or just ignore.
        // For now I'll ignore 'website' or embed it in description.
        // Actually, let's just send what we have, if not in schema it's ignored.
        location: form.location,
        departments: form.departments,
        deadline: form.deadline,
        // companyName: auto-filled by backend from user details
      });

      alert("Job Posted Successfully! 🚀");

      setForm({
        title: "",
        description: "",
        skills: "",
        salary: "",
        location: "",
        type: "Full-time",
        deadline: "",
      });

      if (refresh) refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = [
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

  const handleDepartmentChange = (dept) => {
    setForm((prev) => {
      const exists = prev.departments.includes(dept);

      return {
        ...prev,
        departments: exists
          ? prev.departments.filter((d) => d !== dept)
          : [...prev.departments, dept],
      };
    });
  };

  return (
    <div className="flex justify-center px-4 max-w-4xl mx-auto">
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-0"></div>

        <h1 className="text-3xl font-bold text-white mb-8 flex items-center relative z-10">
          <span className="bg-blue-600 p-2 rounded-lg mr-3 shadow-lg shadow-blue-500/30">
            💼
          </span>{" "}
          Post a New Job
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 relative z-10"
        >
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
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
              Job Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
            </select>
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

          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
              Eligible Departments
            </label>

            <div className="flex flex-wrap gap-3">
              {departmentOptions.map((dept) => (
                <label
                  key={dept}
                  className={`px-4 py-2 rounded-lg border cursor-pointer transition 
        ${
          form.departments.includes(dept)
            ? "bg-green-600 border-green-500 text-white"
            : "bg-slate-900 border-slate-700 text-slate-300"
        }`}
                >
                  <input
                    type="checkbox"
                    value={dept}
                    checked={form.departments.includes(dept)}
                    onChange={() => handleDepartmentChange(dept)}
                    className="hidden"
                  />

                  {dept}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs uppercase tracking-wider font-bold ml-1">
              Application Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 outline-none"
              required
            />

            <span className="text-xs text-slate-500 ml-1">
              Students cannot apply after this date
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1 active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Posting Job..." : "Publish Job Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
