import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  CheckSquare, 
  MessageSquare
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isInstructor, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                LearnSphere
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                Online Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/courses"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/courses')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Course Catalog
            </Link>

            {isAuthenticated && isStudent && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-learning"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/my-learning')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Learning
                </Link>
              </>
            )}

            {isAuthenticated && isInstructor && (
              <>
                <Link
                  to="/instructor"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/instructor')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Instructor Hub
                </Link>
                <Link
                  to="/instructor/courses"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/instructor/courses')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Manage Courses
                </Link>
                <Link
                  to="/instructor/submissions"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/instructor/submissions')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Submissions
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    {isStudent && (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Student Dashboard
                      </Link>
                    )}

                    {isInstructor && (
                      <Link
                        to="/instructor"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Instructor Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow-sm transition-all"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            Course Catalog
          </Link>

          {isAuthenticated ? (
            <>
              {isStudent && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/my-learning"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Learning
                  </Link>
                </>
              )}

              {isInstructor && (
                <>
                  <Link
                    to="/instructor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Instructor Dashboard
                  </Link>
                  <Link
                    to="/instructor/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Manage Courses
                  </Link>
                  <Link
                    to="/instructor/submissions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Review Submissions
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                Profile ({user?.name})
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
