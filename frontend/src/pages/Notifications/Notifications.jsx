import { useState } from 'react';
import {
  UserPlus,
  MessageSquare,
  ArrowRightLeft,
  AtSign,
  Clock,
  Users,
  CheckCheck,
  Inbox,
  Trash2,
} from 'lucide-react';

// Dummy data — baad mein API/socket se replace karenge
const dummyNotifications = [
  {
    id: 1,
    type: 'card_assigned',
    actor: 'Ritik',
    message: 'assigned you to',
    target: '"Login Page UI"',
    time: '2m ago',
    group: 'Today',
    isRead: false,
  },
  {
    id: 2,
    type: 'comment_added',
    actor: 'Pujitha',
    message: 'commented on',
    target: '"Profile Page"',
    time: '15m ago',
    group: 'Today',
    isRead: false,
  },
  {
    id: 3,
    type: 'mention',
    actor: 'Tushar',
    message: 'mentioned you in',
    target: '"API Integration"',
    time: '1h ago',
    group: 'Today',
    isRead: false,
  },
  {
    id: 4,
    type: 'card_moved',
    actor: 'Sohel',
    message: 'moved',
    target: '"API Integration" to In Progress',
    time: '4h ago',
    group: 'Today',
    isRead: true,
  },
  {
    id: 5,
    type: 'card_assigned',
    actor: 'Alka',
    message: 'assigned you to',
    target: '"Notification Module"',
    time: 'Yesterday, 6:10 PM',
    group: 'Earlier',
    isRead: true,
  },
  {
    id: 6,
    type: 'comment_added',
    actor: 'Ritik',
    message: 'replied to your comment on',
    target: '"Database Schema"',
    time: 'Yesterday, 11:42 AM',
    group: 'Earlier',
    isRead: true,
  },
  {
    id: 7,
    type: 'due_date',
    actor: 'Reminder',
    message: 'due date is approaching for',
    target: '"Deploy to Staging"',
    time: 'Yesterday, 9:00 AM',
    group: 'Earlier',
    isRead: true,
  },
  {
    id: 8,
    type: 'workspace_invite',
    actor: 'Nicks83167',
    message: 'invited you to',
    target: 'workspace "Zaalima Dev Team"',
    time: '2d ago',
    group: 'Earlier',
    isRead: true,
  },
];

const typeConfig = {
  card_assigned: { icon: UserPlus, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  comment_added: { icon: MessageSquare, bg: 'bg-teal-50', text: 'text-teal-600' },
  card_moved: { icon: ArrowRightLeft, bg: 'bg-amber-50', text: 'text-amber-600' },
  mention: { icon: AtSign, bg: 'bg-rose-50', text: 'text-rose-600' },
  due_date: { icon: Clock, bg: 'bg-orange-50', text: 'text-orange-600' },
  workspace_invite: { icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

function NotificationRow({ notification, onRead, onDelete }) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      onClick={() => !notification.isRead && onRead(notification.id)}
      className={`group relative flex items-start gap-3.5 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50 ${
        !notification.isRead ? 'bg-indigo-50/30' : ''
      }`}
    >
      {!notification.isRead && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
      )}

      <div
        className={`flex items-center justify-center h-9 w-9 rounded-full shrink-0 ${config.bg} ${config.text}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13.5px] text-slate-700 leading-snug">
          <span className="font-semibold text-slate-900">{notification.actor}</span>{' '}
          {notification.message}{' '}
          <span className="font-medium text-slate-900">{notification.target}</span>
        </p>
        <span className="text-xs text-slate-400 mt-0.5 block">{notification.time}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all shrink-0"
        aria-label="Delete notification"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  const groups = filtered.reduce((acc, n) => {
    acc[n.group] = acc[n.group] || [];
    acc[n.group].push(n);
    return acc;
  }, {});

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors shrink-0"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>

        <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 mb-5">
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Inbox className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                {filter === 'unread' ? 'Nothing unread' : 'No notifications'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                New activity on your boards will show up here.
              </p>
            </div>
          ) : (
            Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName}>
                <div className="px-5 py-2 bg-slate-50/80 border-y border-slate-100">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {groupName}
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {items.map((n) => (
                    <NotificationRow
                      key={n.id}
                      notification={n}
                      onRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}q
