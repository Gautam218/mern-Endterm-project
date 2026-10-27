import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { orderService, userService } from "../services/api";
import {
  Activity,
  User,
  Lock,
  Building2,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

export const UserDashboardPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "profile" | "security"
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    hospitalName: user?.hospitalName || "",
    address: user?.address || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await orderService.getOrderByUser(user._id);
      setOrders(res?.Order || []);
    } catch (err) {
      console.error("Error loading user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userService.editUser({
        uId: user._id,
        name: profileData.name,
        phoneNumber: profileData.phoneNumber,
        hospitalName: profileData.hospitalName,
        address: profileData.address,
      });

      if (res.success) {
        updateUserProfile(profileData);
        addToast("Hospital profile updated successfully", "success");
      } else {
        addToast(res.error || res.message || "Failed to update profile", "error");
      }
    } catch (err) {
      addToast("Server error updating profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("New passwords do not match", "warning");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast("Password must be at least 6 characters", "warning");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await userService.changePassword({
        uId: user._id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        addToast("Password changed successfully", "success");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        addToast(res.error || res.message || "Incorrect current password", "error");
      }
    } catch (err) {
      addToast("Server error changing password", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  // Helper for status badge & styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Request Accepted":
      case "In Transit":
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Under Scrutiny":
      case "Not processed":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Expired":
      case "Cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Hospital Operations Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {user?.hospitalName || user?.name || "Transplant Surgical Center"}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Surgeon In-charge: {user?.name} • Official: {user?.email}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-white/10">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Organ Requests ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Hospital Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "security"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Tab 1: Organ Requisitions Log */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active & Past Allograft Transfer Records</h3>
            <button
              onClick={fetchUserOrders}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-400 border-t-transparent mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 rounded-3xl glass text-center max-w-md mx-auto space-y-3">
              <Activity className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Transfer Requests Yet</h4>
              <p className="text-xs text-slate-400">
                You have not initiated any organ transfer protocols yet. Browse the registry to requisition compatible allografts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 rounded-3xl glass-card border border-white/10 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white tracking-wide">
                          {order.transactionId}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>Submitted on: {new Date(order.createdAt).toLocaleString("en-IN")}</span>
                      </p>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Token Fee</span>
                      <p className="text-base font-mono font-bold text-emerald-400">
                        ₹{order.amount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Transfer Progression Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 text-center text-xs gap-2">
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold mx-auto flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                        <span className="text-slate-300 font-semibold text-[11px]">Submitted</span>
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-[10px] ${
                            ["Under Scrutiny", "Request Accepted", "In Transit", "Delivered"].includes(
                              order.status
                            )
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {["Under Scrutiny", "Request Accepted", "In Transit", "Delivered"].includes(
                            order.status
                          )
                            ? "✓"
                            : "2"}
                        </div>
                        <span className="text-slate-300 font-semibold text-[11px]">Under Scrutiny</span>
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-[10px] ${
                            ["Request Accepted", "In Transit", "Delivered"].includes(order.status)
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {["Request Accepted", "In Transit", "Delivered"].includes(order.status)
                            ? "✓"
                            : "3"}
                        </div>
                        <span className="text-slate-300 font-semibold text-[11px]">Accepted</span>
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-[10px] ${
                            order.status === "Delivered"
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {order.status === "Delivered" ? "✓" : "4"}
                        </div>
                        <span className="text-slate-300 font-semibold text-[11px]">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Allografts In Order */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Allografts Allocated:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.allProduct?.map((item, idx) => {
                        const organ = item.id;
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-white">{organ?.pName || "Organ Allograft"}</p>
                              <p className="text-[10px] text-slate-400">
                                {organ?.pBloodGroup ? `${organ.pBloodGroup} Compatible • ` : ""}
                                Quota: {item.quantitiy || 1} unit(s)
                              </p>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold">
                              ₹{(organ?.pPrice || order.amount)?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Destination notes */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{order.address}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{order.phone}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Hospital Profile */}
      {activeTab === "profile" && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl glass border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Hospital Center Credentials</h3>
            <p className="text-xs text-slate-400">Update medical facility contact and lead surgeon in-charge details</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Surgeon / Department In-charge
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hospital / Institution Name
              </label>
              <input
                type="text"
                value={profileData.hospitalName}
                onChange={(e) => setProfileData({ ...profileData, hospitalName: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Operating Theater & Ward Address
              </label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider"
            >
              {savingProfile ? "Saving..." : "Save Hospital Details"}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl glass border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Security & Password</h3>
            <p className="text-xs text-slate-400">Keep your transplant surgical portal authorization secure</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Secure Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-3 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default UserDashboardPage;
