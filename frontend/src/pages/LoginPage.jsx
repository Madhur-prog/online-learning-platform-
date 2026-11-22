import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import Alert from '../components/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'instructor') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to LearnSphere
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your courses, quizzes, and learning materials
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Quick Demo Login Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student@learnsphere.com', 'Password123!')}
              className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition-colors group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Student Account</div>
              <div className="text-[11px] text-slate-500">Alex Chen</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('instructor@learnsphere.com', 'Password123!')}
              className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition-colors group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Instructor Account</div>
              <div className="text-[11px] text-slate-500">Dr. Sarah Jenkins</div>
            </button>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Login Form */}
        <form className="mt-6 space-y-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
