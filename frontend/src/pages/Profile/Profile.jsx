import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
    if (successMsg) setSuccessMsg('');
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

  if (!user) return <Loader fullScreen />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
          <Avatar src={user.avatar} alt={user.name} size="xl" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded">
              {user.role}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {successMsg && <div className="text-sm text-green-600 bg-green-50 p-3 rounded">{successMsg}</div>}

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader size="sm" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;