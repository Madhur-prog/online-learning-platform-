import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  CheckSquare,
  User,
  LogOut,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, isInstructor, logout } = useAuth();
  const location = useLocation();

  const studentNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Enrolled Courses', path: '/my-learning', icon: BookOpen },
    { label: 'Course Catalog', path: '/courses', icon: GraduationCap },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const instructorNavItems = [
    { label: 'Instructor Hub', path: '/instructor', icon: LayoutDashboard },
    { label: 'Manage Courses', path: '/instructor/courses', icon: FolderKanban },
    { label: 'Review Submissions', path: '/instructor/submissions', icon: CheckSquare },
    { label: 'Course Catalog', path: '/courses', icon: GraduationCap },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const navItems = isInstructor ? instructorNavItems : studentNavItems;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-24">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h3>
                <span className="inline-block mt-0.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="mt-5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-white/80" />}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
