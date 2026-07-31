import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
// Icons ke liye lucide-react use kiya hai
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { changePassword, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [mismatchError, setMismatchError] = useState('');
  
  // Password visibility toggle states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (mismatchError) setMismatchError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Inline validation instead of alert
    if (formData.newPassword !== formData.confirmPassword) {
      setMismatchError('New passwords do not match. Please try again.');
      return;
    }

    try {
      await changePassword({ 
        currentPassword: formData.currentPassword, 
        newPassword: formData.newPassword 
      });
      setSuccessMsg('Password changed successfully! Please login again.');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  // Reusable Password Input Wrapper with Toggle Icon
  const PasswordField = ({ label, name, value }) => (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={showPasswords[name === 'currentPassword' ? 'current' : name === 'newPassword' ? 'new' : 'confirm'] ? "text" : "password"}
        value={value}
        onChange={handleChange}
        required
        className="pr-12" // Space for the eye icon
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(name === 'currentPassword' ? 'current' : name === 'newPassword' ? 'new' : 'confirm')}
        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        tabIndex={-1}
      >
        {showPasswords[name === 'currentPassword' ? 'current' : name === 'newPassword' ? 'new' : 'confirm'] ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ShieldCheck className="text-indigo-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Security Settings</h1>
          </div>
          <p className="text-gray-500 ml-14">Manage your account security and update your password.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Lock className="text-gray-700" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Password Fields */}
            <PasswordField label="Current Password" name="currentPassword" value={formData.currentPassword} />
            <PasswordField label="New Password" name="newPassword" value={formData.newPassword} />
            <PasswordField label="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} />

            {/* Mismatch Error (Replaces alert) */}
            {mismatchError && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-lg animate-in fade-in">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{mismatchError}</span>
              </div>
            )}

            {/* API Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-lg">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-lg">
                <CheckCircle2 size={18} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer tip */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Make sure to use a strong password with at least 8 characters, including letters and numbers.
        </p>
      </div>
    </div>
  );
};

export default Settings;