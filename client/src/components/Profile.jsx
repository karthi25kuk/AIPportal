import { useEffect, useState } from "react";
import { User, Mail, Hash, Building, Globe, Briefcase, Plus, X, Edit3, Save, RotateCcw,Phone } from "lucide-react";
import api from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.data);
        setForm(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const res = await api.put("/api/auth/profile", form);
      setUser(res.data.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setForm({
      ...form,
      studentDetails: {
        ...form.studentDetails,
        skills: [...(form.studentDetails?.skills || []), newSkill.trim()],
      },
    });
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      studentDetails: {
        ...form.studentDetails,
        skills: form.studentDetails.skills.filter((s) => s !== skillToRemove),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
            <User size={48} className="text-white" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white">{form.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                {user.role}
              </span>
              <span className="text-indigo-100 flex items-center gap-1 text-sm">
                <Mail size={14} /> {form.email}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setEditing(false); setForm(user); }}
                  className="flex items-center gap-2 bg-slate-800/50 text-white px-4 py-2.5 rounded-xl font-medium border border-white/10 hover:bg-slate-800 transition-all"
                >
                  <RotateCcw size={18} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-emerald-400 transition-all"
                >
                  <Save size={18} /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
            <div className="space-y-4">
              <ProfileField
                icon={<User size={18} />}
                label="Full Name"
                value={form.name}
                editing={editing}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <ProfileField
                icon={<Mail size={18} />}
                label="Email Address"
                value={form.email}
                editing={false} // Email usually stays locked
              />
            </div>
          </section>
        </div>

        {/* Right Column: Role Specific Details */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={16} /> Professional Details
            </h3>

            {user.role === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileField
                  icon={<Hash size={18} />}
                  label="Roll Number"
                  value={form.studentDetails?.rollNumber}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, studentDetails: { ...form.studentDetails, rollNumber: v } })}
                />
                <ProfileField
                  icon={<Building size={18} />}
                  label="Department"
                  value={form.studentDetails?.department}
                  editing={false}
                />

                <div className="col-span-full pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-500 mb-3 font-medium">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {(form.studentDetails?.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="group flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-all"
                      >
                        {skill}
                        {editing && (
                          <button onClick={() => removeSkill(skill)} className="text-indigo-400/50 hover:text-red-400 transition-colors">
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                    {editing && (
                      <div className="flex items-center gap-2 w-full mt-2">
                        <input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="Add skill (e.g. React)"
                          className="flex-1 bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                        <button
                          onClick={addSkill}
                          className="bg-indigo-600 p-2.5 rounded-xl text-white hover:bg-indigo-500 transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {user.role === "industry" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileField
                  icon={<Hash size={18} />}
                  label="Company ID"
                  value={form.industryDetails?.companyID}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, industryDetails: { ...form.industryDetails, companyID: v } })}
                />
                <ProfileField
                  icon={<Building size={18} />}
                  label="Company Type"
                  value={form.industryDetails?.companyType}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, industryDetails: { ...form.industryDetails, companyType: v } })}
                />
                <div className="col-span-full">
                  <ProfileField
                    icon={<Globe size={18} />}
                    label="Website"
                    value={form.industryDetails?.website}
                    editing={editing}
                    onChange={(v) => setForm({ ...form, industryDetails: { ...form.industryDetails, website: v } })}
                  />
                </div>
              </div>
            )}

            {user.role === "college" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileField
                  icon={<User size={18} />}
                  label="Placement Officer"
                  value={form.collegeDetails?.placementOfficer}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, collegeDetails: { ...form.collegeDetails, placementOfficer: v } })}
                />
                <ProfileField
                  icon={<Phone size={18} />}
                  label="Contact Number"
                  value={form.collegeDetails?.contactNumber}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, collegeDetails: { ...form.collegeDetails, contactNumber: v } })}
                />
                <ProfileField
                  icon={<Globe size={18} />}
                  label="Website"
                  value={form.collegeDetails?.website}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, collegeDetails: { ...form.collegeDetails, website: v } })}
                />
                <ProfileField
                  icon={<Building size={18} />}
                  label="Address"
                  value={form.collegeDetails?.address}
                  editing={editing}
                  onChange={(v) => setForm({ ...form, collegeDetails: { ...form.collegeDetails, address: v } })}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- Optimized Field Component ---------- */

function ProfileField({ icon, label, value, editing, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>

      {editing && onChange ? (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
        />
      ) : (
        <div className="text-slate-200 font-medium px-1 py-1">
          {value || <span className="text-slate-600 italic font-normal">Not provided</span>}
        </div>
      )}
    </div>
  );
}