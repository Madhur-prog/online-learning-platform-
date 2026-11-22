import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Decorative background glow accents (subtle, non-distracting) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header: Brand Identity Only (No navigation links) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              LearnSphere
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              Online Learning Platform
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure Academic Authentication</span>
        </div>
      </header>

      {/* Centered Main Authentication Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Minimalist Auth Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 relative z-10 border-t border-slate-200/60">
        <p>© {new Date().getFullYear()} LearnSphere Education Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
