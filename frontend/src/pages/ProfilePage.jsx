import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { User, Mail, Shield, Calendar, Edit3, Save, CheckCircle2 } from 'lucide-react';
import Alert from '../components/Alert';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const { user, updateProfileState, isInstructor } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const res = await api.put('/auth/profile', { name, bio });
      if (res.data.success) {
        updateProfileState(res.data.user);
        setEditing(false);
        setNotification({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your personal details, biography, and role credentials.
        </p>
      </div>

      {notification && (
        <Alert
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900" />

        <div className="px-6 pb-6 pt-0 relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-md">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-3xl shadow-xs">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
              </div>
              <div className="space-y-1 mb-1">
                <h2 className="text-xl font-extrabold text-slate-900">{user?.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <Shield className="w-3 h-3" />
                    {user?.role}
                  </span>
                  <span className="text-xs text-slate-400">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Biography / Academic Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary about your background..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                    Registered Email
                  </span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block">{user?.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                    Platform Access
                  </span>
                  <span className="text-slate-800 font-bold text-sm mt-0.5 block capitalize">
                    {user?.role} Tier
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Biography
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                  {user?.bio || 'No biography added yet.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
