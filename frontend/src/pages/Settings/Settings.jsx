import React, { useState } from 'react';
<<<<<<< HEAD
import {
  User, Lock, Briefcase, Bell, Palette, Shield, AlertTriangle,
  Camera, Monitor, Moon, Sun, ChevronRight, LogOut, Trash2, UserMinus,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import { useAuthStore } from '../../store/useAuthStore';

// ─── Toggle Switch ──────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      checked ? 'bg-primary-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ─── Section Card ────────────────────────────────────────────────────────────
const SectionCard = ({ id, icon: Icon, title, description, children }) => (
  <div id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-50">
        <Icon size={18} className="text-primary-600" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// ─── Toggle Row ──────────────────────────────────────────────────────────────
const ToggleRow = ({ id, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex-1 min-w-0 pr-4">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <Toggle id={id} checked={checked} onChange={onChange} />
  </div>
);

// ─── Confirm Modal ───────────────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, onClose, title, description, confirmLabel, onConfirm, danger = true }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="space-y-4">
      <div className={`flex items-start gap-3 p-3 rounded-lg ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
        <AlertTriangle size={18} className={danger ? 'text-red-500 mt-0.5 shrink-0' : 'text-amber-500 mt-0.5 shrink-0'} />
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'account',       label: 'Account',       icon: Lock },
  { id: 'workspace',     label: 'Workspace',     icon: Briefcase },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'danger',        label: 'Danger Zone',   icon: AlertTriangle },
];

// ════════════════════════════════════════════════════════════════════════════
const Settings = () => {
  const { user } = useAuthStore();

  // ── Active nav ──────────────────────────────────────────────────────────
  const [activeNav, setActiveNav] = useState('profile');

  // ── Profile ─────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Johnson',
    username: user?.username || 'alexjohnson',
    email: user?.email || 'alex@collabspace.io',
    bio: 'Product designer & developer. Passionate about great user experiences.',
  });

  // ── Account ─────────────────────────────────────────────────────────────
  const [account, setAccount] = useState({
    language: 'English (US)',
    timezone: 'Asia/Kolkata (IST +5:30)',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ── Workspace ────────────────────────────────────────────────────────────
  const [workspace, setWorkspace] = useState({
    name: 'CollabSpace HQ',
    description: 'Our main product development workspace.',
    visibility: 'private',
    allowInvites: true,
  });

  // ── Notifications ────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    mentions: true,
    weeklySummary: false,
  });

  // ── Appearance ───────────────────────────────────────────────────────────
  const [appearance, setAppearance] = useState({
    theme: 'system',
    compactMode: false,
    animations: true,
  });

  // ── Security ─────────────────────────────────────────────────────────────
  const [twoFA, setTwoFA] = useState(false);
  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'Mumbai, IN', time: 'Active now', current: true },
    { id: 2, device: 'Safari on iPhone 15', location: 'Pune, IN', time: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on MacBook', location: 'Bangalore, IN', time: 'Yesterday', current: false },
  ];

  // ── Modals ───────────────────────────────────────────────────────────────
  const [modal, setModal] = useState(null);
  const openModal = (key) => setModal(key);
  const closeModal = () => setModal(null);

  // ── Toast (inline feedback) ──────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = (section) => showToast(`${section} settings saved!`);

  // ── Nav scroll ───────────────────────────────────────────────────────────
  const scrollTo = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account, workspace, and preferences.</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left Sticky Nav ─────────────────────────────────────────── */}
        <nav className="hidden lg:flex flex-col w-52 shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-4">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${
                activeNav === id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${id === 'danger' ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : ''}`}
            >
              <Icon size={16} />
              {label}
              <ChevronRight size={14} className="ml-auto opacity-40" />
            </button>
          ))}
        </nav>

        {/* ── Main Content ────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6 min-w-0">

          {/* ── 1. Profile ──────────────────────────────────────────── */}
          <SectionCard id="profile" icon={User} title="Profile" description="Update your public profile information">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar src={user?.avatar} alt={profile.name} size="xl" />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
                  <Camera size={13} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                <p className="text-xs text-gray-500">@{profile.username}</p>
                <button className="text-xs text-primary-600 hover:underline mt-1">Change avatar</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                  placeholder="Tell your team a little about yourself…"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave('Profile')}>Save Changes</Button>
            </div>
          </SectionCard>

          {/* ── 2. Account ──────────────────────────────────────────── */}
          <SectionCard id="account" icon={Lock} title="Account" description="Language, timezone, and password settings">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={account.language}
                    onChange={(e) => setAccount({ ...account, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    value={account.timezone}
                    onChange={(e) => setAccount({ ...account, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>Asia/Kolkata (IST +5:30)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>America/New_York (EST -5:00)</option>
                    <option>America/Los_Angeles (PST -8:00)</option>
                    <option>Europe/London (GMT+1)</option>
                    <option>Asia/Tokyo (JST +9:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-800 mb-3">Change Password</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={account.currentPassword}
                    onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={account.newPassword}
                    onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={account.confirmPassword}
                    onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave('Account')}>Save Changes</Button>
            </div>
          </SectionCard>

          {/* ── 3. Workspace ────────────────────────────────────────── */}
          <SectionCard id="workspace" icon={Briefcase} title="Workspace" description="Configure your workspace details and member access">
            <div className="space-y-4">
              <Input
                label="Workspace Name"
                value={workspace.name}
                onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={workspace.description}
                  onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <div className="flex gap-3">
                  {['public', 'private'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setWorkspace({ ...workspace, visibility: v })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors capitalize ${
                        workspace.visibility === v
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {v === 'public' ? '🌐 Public' : '🔒 Private'}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleRow
                id="allow-invites"
                label="Allow Member Invites"
                description="Members can invite others to this workspace"
                checked={workspace.allowInvites}
                onChange={(val) => setWorkspace({ ...workspace, allowInvites: val })}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave('Workspace')}>Save Changes</Button>
            </div>
          </SectionCard>

          {/* ── 4. Notifications ────────────────────────────────────── */}
          <SectionCard id="notifications" icon={Bell} title="Notifications" description="Choose how and when you want to be notified">
            <div className="divide-y divide-gray-50">
              <ToggleRow
                id="notif-email"
                label="Email Notifications"
                description="Receive updates directly to your inbox"
                checked={notifications.email}
                onChange={(val) => setNotifications({ ...notifications, email: val })}
              />
              <ToggleRow
                id="notif-push"
                label="Push Notifications"
                description="Browser and mobile push alerts"
                checked={notifications.push}
                onChange={(val) => setNotifications({ ...notifications, push: val })}
              />
              <ToggleRow
                id="notif-tasks"
                label="Task Updates"
                description="When a task is assigned, updated, or completed"
                checked={notifications.taskUpdates}
                onChange={(val) => setNotifications({ ...notifications, taskUpdates: val })}
              />
              <ToggleRow
                id="notif-mentions"
                label="Mentions"
                description="When someone @mentions you in comments"
                checked={notifications.mentions}
                onChange={(val) => setNotifications({ ...notifications, mentions: val })}
              />
              <ToggleRow
                id="notif-weekly"
                label="Weekly Summary"
                description="A weekly digest of your workspace activity"
                checked={notifications.weeklySummary}
                onChange={(val) => setNotifications({ ...notifications, weeklySummary: val })}
              />
            </div>
          </SectionCard>

          {/* ── 5. Appearance ───────────────────────────────────────── */}
          <SectionCard id="appearance" icon={Palette} title="Appearance" description="Customize how CollabSpace looks for you">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light',  label: 'Light',  icon: Sun },
                    { value: 'dark',   label: 'Dark',   icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setAppearance({ ...appearance, theme: value })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        appearance.theme === value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                <ToggleRow
                  id="compact-mode"
                  label="Compact Mode"
                  description="Reduce spacing for a denser layout"
                  checked={appearance.compactMode}
                  onChange={(val) => setAppearance({ ...appearance, compactMode: val })}
                />
                <ToggleRow
                  id="animations"
                  label="Animations"
                  description="Enable smooth transitions and micro-animations"
                  checked={appearance.animations}
                  onChange={(val) => setAppearance({ ...appearance, animations: val })}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── 6. Security ─────────────────────────────────────────── */}
          <SectionCard id="security" icon={Shield} title="Security" description="Two-factor authentication and active sessions">
            <div className="space-y-5">
              <ToggleRow
                id="2fa"
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                checked={twoFA}
                onChange={setTwoFA}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-800">Active Sessions</p>
                  <button
                    onClick={() => openModal('logoutAll')}
                    className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <LogOut size={13} /> Logout All
                  </button>
                </div>
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${s.current ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{s.device}</p>
                          <p className="text-xs text-gray-500">{s.location} · {s.time}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Current</span>
                      ) : (
                        <button className="text-xs text-red-500 hover:underline">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── 7. Danger Zone ──────────────────────────────────────── */}
          <div
            id="danger"
            className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
                <p className="text-xs text-red-400 mt-0.5">These actions are irreversible. Proceed with caution.</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                {
                  key: 'leaveWorkspace',
                  icon: UserMinus,
                  title: 'Leave Workspace',
                  desc: 'You will lose access to all projects, boards, and data in this workspace.',
                  label: 'Leave Workspace',
                },
                {
                  key: 'deleteWorkspace',
                  icon: Trash2,
                  title: 'Delete Workspace',
                  desc: 'Permanently delete this workspace and all its content. This cannot be undone.',
                  label: 'Delete Workspace',
                },
                {
                  key: 'deleteAccount',
                  icon: Trash2,
                  title: 'Delete Account',
                  desc: 'Permanently delete your account and all associated data across every workspace.',
                  label: 'Delete Account',
                },
              ].map(({ key, icon: Icon, title, desc, label }) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50 border border-red-100"
                >
                  <div className="flex items-start gap-3">
                    <Icon size={17} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">{title}</p>
                      <p className="text-xs text-red-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="shrink-0 sm:self-center"
                    onClick={() => openModal(key)}
                  >
                    {label}
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-slide-in">
          ✓ {toast}
        </div>
      )}

      {/* ── Confirmation Modals ─────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={modal === 'logoutAll'}
        onClose={closeModal}
        title="Logout All Devices"
        description="All active sessions except the current one will be terminated immediately."
        confirmLabel="Logout All"
        onConfirm={() => showToast('All other sessions terminated.')}
      />
      <ConfirmModal
        isOpen={modal === 'leaveWorkspace'}
        onClose={closeModal}
        title="Leave Workspace"
        description="You will immediately lose access to all projects and data in CollabSpace HQ."
        confirmLabel="Leave Workspace"
        onConfirm={() => showToast('Left workspace.')}
      />
      <ConfirmModal
        isOpen={modal === 'deleteWorkspace'}
        onClose={closeModal}
        title="Delete Workspace"
        description="This will permanently delete the workspace and all its data. This action cannot be undone."
        confirmLabel="Delete Workspace"
        onConfirm={() => showToast('Workspace deleted.')}
      />
      <ConfirmModal
        isOpen={modal === 'deleteAccount'}
        onClose={closeModal}
        title="Delete Account"
        description="Your account and all associated data will be permanently removed. You cannot recover it."
        confirmLabel="Delete My Account"
        onConfirm={() => showToast('Account deletion requested.')}
      />
=======
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
>>>>>>> a728168a44bdac3dd5079fac37d090269eff757b
    </div>
  );
};

export default Settings;