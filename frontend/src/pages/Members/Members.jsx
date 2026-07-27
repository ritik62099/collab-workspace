import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { formatters } from '../../utils/formatters';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Dropdown, { DropdownItem } from '../../components/common/Dropdown';

const Members = () => {
  const { id } = useParams(); // Workspace ID from URL
  const navigate = useNavigate();
  const { currentWorkspace, fetchWorkspaceById } = useWorkspaceStore();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkspaceById(id);
      fetchMembers();
    }
  }, [id]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await workspaceService.getMembers(id);
      setMembers(res.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await workspaceService.updateMemberRole(id, userId, newRole);
      // Update local state
      setMembers(members.map(m => 
        m.user._id === userId ? { ...m, role: newRole } : m
      ));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName} from this workspace?`)) return;
    
    try {
      await workspaceService.removeMember(id, userId);
      setMembers(members.filter(m => m.user._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate(`/workspace/${id}`)} className="text-sm text-gray-500 hover:text-orange-600 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Workspace
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Members of {currentWorkspace?.name || 'Workspace'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your team members and their roles.</p>
        </div>
        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-medium">
          {members.length} Members
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Member</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.user._id} className="hover:bg-gray-50 transition-colors">
                {/* Member Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Avatar src={member.user.avatar} alt={member.user.name} size="md" />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        {member.user.name}
                        {member.isOwner && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                            OWNER
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">{member.user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize
                    ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                      member.role === 'viewer' ? 'bg-gray-100 text-gray-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {member.role}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="px-6 py-4 text-gray-500">
                  {formatters.formatDate(member.joinedAt || currentWorkspace?.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  {!member.isOwner && (
                    <div className="flex items-center justify-end space-x-2">
                      {/* Role Dropdown */}
                      <Dropdown
                        align="right"
                        trigger={
                          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Change Role
                          </button>
                        }
                      >
                        <DropdownItem onClick={() => handleRoleChange(member.user._id, 'admin')}>
                          Make Admin
                        </DropdownItem>
                        <DropdownItem onClick={() => handleRoleChange(member.user._id, 'member')}>
                          Make Member
                        </DropdownItem>
                        <DropdownItem onClick={() => handleRoleChange(member.user._id, 'viewer')}>
                          Make Viewer
                        </DropdownItem>
                      </Dropdown>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveMember(member.user._id, member.user.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Member"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;