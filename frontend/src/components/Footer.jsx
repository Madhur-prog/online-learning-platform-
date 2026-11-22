import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Globe, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                LearnSphere
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering learners worldwide with production-ready curriculum, interactive video lessons, real-time assessments, and dynamic discussions.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/my-learning" className="hover:text-blue-400 transition-colors">My Learning</Link></li>
            </ul>
          </div>

          {/* Instructors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Instructors</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/instructor" className="hover:text-blue-400 transition-colors">Instructor Portal</Link></li>
              <li><Link to="/instructor/courses" className="hover:text-blue-400 transition-colors">Course Builder</Link></li>
              <li><Link to="/instructor/submissions" className="hover:text-blue-400 transition-colors">Review Submissions</Link></li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Security & Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Role-Based Access Control</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Enterprise REST Architecture</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@learnsphere.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} LearnSphere Education Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Academic Honor Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
