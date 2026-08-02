import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
// Icons ke liye lucide-react
import { User, Mail, Camera, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) clearError();
    if (successMsg) setSuccessMsg('');
  };

  const handleReset = () => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
      setSuccessMsg('');
      if (error) clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader fullScreen />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={28} />
            </div>
            My Profile
          </h1>
          <p className="text-gray-500 mt-2 ml-14">Manage your personal information and account details.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden transition-all duration-300">
          
          {/* 1. Modern Gradient Header & Overlapping Avatar */}
          <div className="relative">
            {/* Background Gradient (Blue Theme) */}
            <div className="h-36 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">
              <div className="absolute inset-0 bg-black/5"></div> {/* Subtle dark overlay for depth */}
            </div>

            {/* Avatar Section */}
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="relative group cursor-pointer">
                {/* Avatar Wrapper */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl bg-gray-100 overflow-hidden ring-1 ring-black/5">
                  <Avatar src={user.avatar} alt={user.name} size="full" className="w-full h-full object-cover" />
                </div>
                
                {/* Camera Icon Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px]">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. User Info Section */}
          <div className="pt-16 px-6 sm:px-8 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  {user.email}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase tracking-wider w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                {user.role || 'User'}
              </span>
            </div>
          </div>

          {/* 3. Edit Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <User size={20} />
                  </span>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                    <Mail size={20} />
                  </span>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {error && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border border-red-100 p-4 rounded-xl">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-start gap-3 text-sm text-green-700 bg-green-50 border border-green-100 p-4 rounded-xl">
                  <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-lg shadow-blue-200/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader size="sm" className="text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer tip */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your email address is used for login and important account notifications.
        </p>
      </div>
    </div>
  );
};

export default Profile;