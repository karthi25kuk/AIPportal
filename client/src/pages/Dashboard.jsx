import { useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Change role here to test: student / college / industry
  const [activeTab, setActiveTab] = useState("dashboard");

  const role = localStorage.getItem("role") || "student";

  const [pending_Students] = useState([
    { id: 1, name: "Karthi", roll: "EC183", company: "ABC Corp" },
    { id: 2, name: "Priya", roll: "CS103", company: "xy Tech" },
    { id: 3, name: "Anu", roll: "EC134", company: "TCS" },
  ]);

  const [job] = useState([
    { id: 1, role: "coder", skill: "java", company: "ABC Corp" },
    { id: 2, role: "programmer", skill: "python", company: "xy Tech" },
    { id: 3, role: "ui designer", skill: "figma", company: "TCS" },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-slate-800 text-white p-5">
        <h2 className="text-2xl text-blue-600 font-bold mb-8">AIPportal</h2>

        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("dashboard")}
            className="hover:bg-slate-700 p-2 cursor-pointer rounded"
          >
            Dashboard
          </li>
          {(role === "student" ||
            role === "industry" ||
            role === "college") && (
            <li
              onClick={() => setActiveTab("opportunities")}
              className="hover:bg-slate-700 p-2 cursor-pointer rounded"
            >
              Opportunities
            </li>
          )}
          {role === "industry" && (
            <li
              onClick={() => setActiveTab("postjobs")}
              className="hover:bg-slate-700 p-2 cursor-pointer rounded"
            >
              Post Jobs
            </li>
          )}
          {role === "industry" && (
            <li
              onClick={() => setActiveTab("postjobs")}
              className="hover:bg-slate-700 p-2 cursor-pointer rounded"
            >
              My Posted Jobs
            </li>
          )}
          {role === "college" && (
            <li
              onClick={() => setActiveTab("studentapprovals")}
              className="hover:bg-slate-700 p-2 cursor-pointer rounded"
            >
              Student Approvals
            </li>
          )}
          <Link to="/" className="block hover:bg-slate-700 p-2 rounded">
            Logout
          </Link>
        </ul>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Topbar */}
        <div className="flex justify-between mb-10">
          <h1 className="text-2xl text-white font-bold">Welcome, User</h1>

          <span className="bg-blue-600 text-white px-3 py-1 rounded">
            {role.toUpperCase()}
          </span>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-4 gap-4 mb-6 ">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              {role === "student" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Total Registerations
                </p>
              )}
              {role === "college" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Total Students
                </p>
              )}
              {role === "industry" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Total Jobs posted
                </p>
              )}
              {role === "student" && (
                <h2 className="text-xl text-gray-300 ">23</h2>
              )}
              {role === "college" && (
                <h2 className="text-xl text-gray-300 ">34</h2>
              )}
              {role === "industry" && (
                <h2 className="text-xl text-gray-300 ">89</h2>
              )}
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              {role === "student" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Approved Applications
                </p>
              )}
              {role === "college" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Pending Verifications
                </p>
              )}
              {role === "industry" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Total Applicants
                </p>
              )}
              {role === "student" && (
                <h2 className="text-xl text-gray-300 ">23</h2>
              )}
              {role === "college" && (
                <h2 className="text-xl text-gray-300 ">
                  {pending_Students.length}
                </h2>
              )}
              {role === "industry" && (
                <h2 className="text-xl text-gray-300 ">89</h2>
              )}
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 hover:bg-slate-700 transition">
              {role === "student" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Pending Applications
                </p>
              )}
              {role === "college" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Approved Students
                </p>
              )}
              {role === "industry" && (
                <p className="text-xl text-white mb-2 font-bold">
                  Shortlisted Students
                </p>
              )}
              {role === "student" && (
                <h2 className="text-xl text-gray-300 ">23</h2>
              )}
              {role === "college" && (
                <h2 className="text-xl text-gray-300 ">34</h2>
              )}
              {role === "industry" && (
                <h2 className="text-xl text-gray-300 ">89</h2>
              )}
            </div>
          </div>
        )}
        {/* Cards */}

        {/* Role-Based Content */}

        {role === "college" && activeTab === "studentapprovals" && (
          <>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8">
              <h2 className="text-xl  text-white font-bold mb-4">
                Student Approvals
              </h2>
              {pending_Students.map((student) => (
                <div
                  key={student.id}
                  className="grid grid-cols-4 items-center gap-4 p-3 mb-4 bg-slate-800 border border-gray-600 rounded-md"
                >
                  <div className="text-white font-medium truncate">
                    {student.name}
                  </div>

                  <div className="text-white truncate">{student.roll}</div>

                  <div className="text-white truncate">{student.company}</div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Details
                    </button>
                    {selectedStudent && (
                      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        {/* Modal */}
                        <div className="bg-slate-800 w-full max-w-md rounded-xl p-6 relative border border-slate-600 shadow-xl">
                          {/* Close */}
                          <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl"
                          >
                            ✕
                          </button>

                          {/* Title */}
                          <h2 className="text-2xl font-bold text-white mb-6">
                            Student Details
                          </h2>

                          {/* Details */}
                          <div className="space-y-3 text-slate-300">
                            <p>
                              <span className="font-semibold text-white">
                                Name:
                              </span>{" "}
                              {selectedStudent.name}
                            </p>

                            <p>
                              <span className="font-semibold text-white">
                                Roll:
                              </span>{" "}
                              {selectedStudent.roll}
                            </p>

                            <p>
                              <span className="font-semibold text-white">
                                Company:
                              </span>{" "}
                              {selectedStudent.company}
                            </p>

                            {/* Add more fields if available */}
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-3 mt-6">
                            <button className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 text-white">
                              Approve
                            </button>

                            <button className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 text-white">
                              Reject
                            </button>

                            <button
                              onClick={() => setSelectedStudent(null)}
                              className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700 text-white"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition text-sm font-medium">
                      Approve
                    </button>

                    <button className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition text-sm font-medium">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {role === "industry" && activeTab === "postjobs" && (
          <div className="space-y-6">
            <h1 className="text-gray-50 text-lg font-semibold">
              Describe Job Role
            </h1>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 max-w-xl">
              <form className="flex flex-col gap-5 max-w-lg">
                {/* Job Role */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Job Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    placeholder="Brief job description..."
                    rows="3"
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Skills Required
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, SQL..."
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Salary */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Salary
                  </label>
                  <input
                    type="number"
                    placeholder="₹ / month or year"
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Website */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Company Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 text-sm font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City / Remote"
                    className="w-full bg-slate-500/20 text-white py-2.5 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md mt-2"
                >
                  Post Job
                </button>
              </form>
            </div>
          </div>
        )}
        {(role === "student" || role === "college" || role === "industry") &&
          activeTab === "opportunities" && (
            <div className="grid md:grid-cols-3 gap-6">
              {job.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 hover:bg-slate-700 transition"
                >
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {job.role}
                  </h3>
                  <p className="text-slate-300 mb-2">
                    <span className="font-semibold text-white">Company:</span>{" "}
                    {job.company}
                  </p>
                  <p className="text-slate-300 mb-2">
                    <span className="font-semibold text-white">Skills:</span>{" "}
                    {job.skill}
                  </p>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                  >
                    View Details
                  </button>
                  {selectedJob && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                      {/* Modal */}
                      <div className="bg-slate-800 w-full max-w-lg rounded-xl p-6 relative shadow-xl border border-slate-600 animate-fadeIn">
                        {/* Close Button */}
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl"
                        >
                          ✕
                        </button>

                        {/* Content */}
                        <h2 className="text-2xl font-bold text-white mb-4">
                          {selectedJob.role}
                        </h2>

                        <div className="space-y-3 text-slate-300">
                          <p>
                            <span className="text-white font-semibold">
                              Company:
                            </span>{" "}
                            {selectedJob.company}
                          </p>

                          <p>
                            <span className="text-white font-semibold">
                              Skills:
                            </span>{" "}
                            {selectedJob.skill}
                          </p>

                          <p>
                            <span className="text-white font-semibold">
                              Location:
                            </span>{" "}
                            {selectedJob.location || "Not specified"}
                          </p>

                          <p>
                            <span className="text-white font-semibold">
                              Salary:
                            </span>{" "}
                            {selectedJob.salary || "Not disclosed"}
                          </p>

                          <p>
                            <span className="text-white font-semibold">
                              Description:
                            </span>
                            <br />
                            {selectedJob.description ||
                              "No description provided."}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                          {role === "student" && (
                            <button className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 text-white font-medium">
                              Apply
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedJob(null)}
                            className="bg-gray-600 px-5 py-2 rounded-lg hover:bg-gray-700 text-white"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
export default Dashboard;
