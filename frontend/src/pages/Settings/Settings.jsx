import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const Settings = () => {
  const { changePassword, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {successMsg && <div className="text-sm text-green-600 bg-green-50 p-3 rounded">{successMsg}</div>}

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader size="sm" /> : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;