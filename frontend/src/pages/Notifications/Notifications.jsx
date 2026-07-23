import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { formatters } from '../../utils/formatters';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const Notifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    acceptInvite, 
    rejectInvite,
    markAsRead 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptInvite(id);
      // Optional: Show success toast
    } catch (error) {
      console.error('Failed to accept invite:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectInvite(id);
    } catch (error) {
      console.error('Failed to reject invite:', error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    
    // If it's a workspace invite, navigate to workspace after accepting
    if (notif.type === 'workspace_invite') {
      // User should accept first, then navigate. 
      // For now, just mark as read.
    }
  };

  if (loading && notifications.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'You are all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => fetchNotifications()}>
            Refresh
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              onClick={() => handleNotificationClick(notif)}
              className={`bg-white p-4 rounded-lg shadow-sm border transition-all cursor-pointer ${
                notif.isRead ? 'border-gray-100' : 'border-l-4 border-l-orange-500 border-gray-100 bg-orange-50/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-3 flex-1">
                  <Avatar 
                    src={notif.sender?.avatar} 
                    alt={notif.sender?.name || 'User'} 
                    size="md" 
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold text-gray-900">{notif.sender?.name || 'Someone'}</span>{' '}
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatters.formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Workspace Invite Actions */}
                {notif.type === 'workspace_invite' && !notif.isRead && (
                  <div className="flex space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => handleAccept(notif._id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleReject(notif._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;