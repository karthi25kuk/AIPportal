export default function MyApplications({ applications = [] }) {

  const statusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-900/20 border-green-900/50';
      case 'accepted': return 'text-green-400 bg-green-900/20 border-green-900/50';
      case 'rejected': return 'text-red-400 bg-red-900/20 border-red-900/50';
      case 'shortlisted': return 'text-blue-400 bg-blue-900/20 border-blue-900/50';
      default: return 'text-yellow-400 bg-yellow-900/20 border-yellow-900/50';
    }
  };

  return (
    <div className="flex flex-col h-full">

      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="mr-3 p-2 bg-blue-600 rounded-lg">📄</span> My Applications
      </h1>

      {applications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-10">
          <p className="text-xl font-medium mb-2">No Applications Yet</p>
          <p className="text-sm">Start applying to jobs in the "Opportunities" tab!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div
              key={app._id}
              className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-blue-500 transition shadow-sm hover:shadow-md group"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-lg text-white font-bold group-hover:text-blue-400 transition">
                    {app.job?.title || "Job Title Unavailable"}
                  </h2>

                  <p className="text-slate-400 text-sm font-medium mt-1">
                    {app.job?.companyName || "Unknown Company"}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(app.status)}`}>
                  {app.status.replace(/_/g, ' ').toUpperCase()}
                </div>

              </div>

              {/* Optional: Notes Section if rejected or approved */}
              {(app.collegeNotes || app.industryNotes) && (
                <div className="mt-4 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
                  {app.collegeNotes && <p><span className="text-slate-500 font-bold">College:</span> {app.collegeNotes}</p>}
                  {app.industryNotes && <p><span className="text-slate-500 font-bold">Industry:</span> {app.industryNotes}</p>}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
