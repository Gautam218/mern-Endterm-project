import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 — Registry Record Not Found</h1>
      <p className="text-xs text-slate-400 leading-relaxed">
        The requested organ allocation route or portal address does not exist or has been archived.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-btn-emerald text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Live Registry</span>
      </Link>
    </div>
  );
};
export default NotFoundPage;
