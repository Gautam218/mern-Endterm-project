import React from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, HeartHandshake, PhoneCall, ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#040810]/80 backdrop-blur-2xl text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#050b14] rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Organ<span className="text-emerald-400">Ease</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's Next-Generation Real-Time Organ Donation, Hypothermic Cold Ischemia Tracking & Emergency Allocation Network.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>NOTTO Protocol Standard Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Transplant Network</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Available Allografts
                </Link>
              </li>
              <li>
                <Link to="/wish-list" className="hover:text-emerald-400 transition-colors">
                  Emergency Watchlist
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Hypothermic Storage Logs</span>
              </li>
              <li>
                <span className="text-slate-500">Donor Compatibility Matrix</span>
              </li>
            </ul>
          </div>

          {/* Protocol Standards */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Clinical Guidelines</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Kidney: 24-36h HMP Protocol</li>
              <li>Cardiac Allograft: 4-6h STAT</li>
              <li>Whole Liver: 8-12h UW Preservation</li>
              <li>Pulmonary: 6-8h Perfadex Flush</li>
              <li>Ocular Corneas: 14 Days Optisol</li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4" />
              <span>24/7 STAT Dispatch Center</span>
            </div>
            <p className="text-xl font-bold font-mono text-white tracking-tight">
              1800-11-4770
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Toll-free emergency transfer coordination across all regional trauma and organ procurement units.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} OrganEase™ Platform. Engineered with Glassmorphic Precision & Biomedical Standards.</p>
          <div className="flex items-center gap-4">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>Zero Error Organ Routing</span>
            <span>•</span>
            <span>Encrypted Token Allocation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
