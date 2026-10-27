import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { X, Lock, Mail, User, Phone, Building2, ShieldCheck, Sparkles, Hospital } from "lucide-react";

export const AuthModal = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    quickLoginHospital,
    quickLoginAdmin,
  } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    phoneNumber: "",
    hospitalName: "",
    userRole: 0, // 0: Hospital, 1: Procurement Admin
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, userRole: role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (authModalMode === "signin") {
        await login(formData.email, formData.password);
        addToast("Logged in successfully. Welcome to OrganEase!", "success");
      } else {
        await signup(formData);
        addToast("Account created successfully! Please sign in with your credentials.", "success");
        setAuthModalMode("signin");
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoHospital = async () => {
    setLoading(true);
    try {
      await quickLoginHospital();
      addToast("Signed in as AIIMS Transplant Surgery Dept", "success");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await quickLoginAdmin();
      addToast("Signed in as NOTTO Registry Admin", "success");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 mb-3 shadow-glass-glow">
            <Hospital className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {authModalMode === "signin" ? "Access OrganEase Portal" : "Register Medical Institution"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            National Organ & Tissue Transplant Allocation Network
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Instant Access</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoHospital}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>AIIMS Hospital Unit</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Procurement Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("signin");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalMode === "signin"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode("signup");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalMode === "signup"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === "signup" && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Registration Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect(0)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                      formData.userRole === 0
                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <Hospital className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-semibold">Hospital / Unit</div>
                      <div className="text-[10px] opacity-75">Transplant Recipient</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect(1)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                      formData.userRole === 1
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-semibold">Procurement</div>
                      <div className="text-[10px] opacity-75">Registry Admin</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name / Surgeon In-charge */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Surgeon / In-charge Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Dr. Vikram Sethi"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              {/* Hospital / Facility Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hospital or Procurement Facility
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. AIIMS Apex Trauma Unit"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Emergency Phone Contact
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Official Medical Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="doctor@hospital.org"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {authModalMode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="cPassword"
                  value={formData.cPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl glass-btn-emerald flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold mt-2 shadow-lg"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : authModalMode === "signin" ? (
              "Authorize & Enter Portal"
            ) : (
              "Complete Institutional Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AuthModal;
