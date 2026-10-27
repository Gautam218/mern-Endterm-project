import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  HeartHandshake,
  Activity,
  Heart,
  ShoppingBag,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, openLoginModal, quickLoginHospital, quickLoginAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#050b14]/80 border-b border-white/10 shadow-glass">
      {/* Emergency Ticker Top Bar */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-emerald-950/40 border-b border-white/5 py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">National Registry Active</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">
              Hypothermic storages synchronized across 14 Regional Procurement Banks
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              STAT Helpline: <strong className="text-white">1800-11-4770</strong>
            </span>
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <button
                  onClick={quickLoginHospital}
                  className="text-[10px] text-emerald-300 hover:text-emerald-200 underline font-medium"
                >
                  Demo Hospital
                </button>
                <span className="text-slate-600">/</span>
                <button
                  onClick={quickLoginAdmin}
                  className="text-[10px] text-cyan-300 hover:text-cyan-200 underline font-medium"
                >
                  Demo Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-glass-glow group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#050b14] rounded-2xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Organ<span className="text-emerald-400">Ease</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1 hidden sm:block">
                Allograft Allocation
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-2xl p-1 backdrop-blur-md">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive("/")
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Browse Organs
            </Link>
            <Link
              to="/wish-list"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive("/wish-list")
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Watchlist</span>
              {totalWishlist > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {totalWishlist}
                </span>
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                    : "text-cyan-300 hover:text-cyan-200 hover:bg-white/5"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart / Requisition Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl glass-pill text-slate-300 hover:text-white transition-all group"
              title="Organ Requisition Queue"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 shadow-glass-glow animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth Dropdown or Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl glass-pill text-slate-200 hover:text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold leading-tight truncate max-w-[110px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">
                      {isAdmin ? "Registry Admin" : "Hospital Unit"}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {isAdmin ? "National Registry Admin" : "Verified Hospital Unit"}
                        </span>
                      </div>
                    </div>

                    {!isAdmin ? (
                      <>
                        <Link
                          to="/user/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span>My Organ Requests</span>
                        </Link>
                        <Link
                          to="/user/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <User className="w-4 h-4 text-cyan-400" />
                          <span>Hospital Profile</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Command Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/dashboard?tab=products"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>Manage Organ Listings</span>
                        </Link>
                        <Link
                          to="/admin/dashboard?tab=orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Activity className="w-4 h-4 text-amber-400" />
                          <span>Transfer Allocations</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-4 py-2 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass-pill text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Browse Organs
          </Link>
          <Link
            to="/wish-list"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            <span>Emergency Watchlist</span>
            {totalWishlist > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white">
                {totalWishlist}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 hover:bg-white/5"
            >
              Procurement Admin Hub
            </Link>
          )}
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/user/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-white/5"
              >
                My Organ Requests
              </Link>
              <Link
                to="/user/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5"
              >
                Hospital Profile
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
