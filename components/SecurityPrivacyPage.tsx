"use client";

import { useState, useEffect } from "react";
import { Edit2, User } from "lucide-react";
import {
  ArrowLeft,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  Globe,
  Bell,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface SecurityPrivacyPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function SecurityPrivacyPage({ user, onClose, isOpen }: SecurityPrivacyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Real data from database
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: "contacts",
    readReceipts: true,
  });
  const [securityActivities, setSecurityActivities] = useState<any[]>([]);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Fetch security settings and sessions
  const fetchSecurityData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Fetch security settings
      const settingsRes = await fetch(`${API_URL}/sessions/security-settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const settingsData = await settingsRes.json();

      if (settingsData.success) {
        setTwoFactorEnabled(settingsData.data.twoFactorEnabled);
        setDataSharing(settingsData.data.dataSharing);
        setPrivacySettings({
          showProfile: settingsData.data.profileVisibility,
          readReceipts: settingsData.data.readReceipts
        });
      }

      // Fetch active sessions
      const sessionsRes = await fetch(`${API_URL}/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const sessionsData = await sessionsRes.json();

      if (sessionsData.success) {
        const transformed = sessionsData.data.map((s: any) => ({
          id: s.id,
          device: s.deviceName,
          location: s.location || 'Unknown',
          time: formatSessionTime(s.lastActivity),
          status: s.isActive ? 'active' : 'inactive'
        }));
        setSecurityActivities(transformed);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  useEffect(() => {
    if (isOpen) {
      fetchSecurityData();
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;

    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSave = async () => {
    // Handle password change if provided
    if (newPassword && currentPassword) {
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (passwordStrength < 75) {
        if (!confirm('Your password strength is ' + getPasswordStrengthText() + '. Continue anyway?')) {
          return;
        }
      }

      try {
        const token = getAuthToken();
        if (!token) {
          alert('Please login again');
          return;
        }

        const response = await fetch(`${API_URL}/profile/password`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword
          })
        });

        const data = await response.json();

        if (data.success) {
          alert('Password changed successfully!');
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setIsEditing(false);
        } else {
          alert(data.message || 'Failed to change password');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password. Please try again.');
      }
    } else {
      // Save security settings to database
      try {
        const token = getAuthToken();
        if (!token) {
          alert('Please login again');
          return;
        }

        const response = await fetch(`${API_URL}/sessions/security-settings`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            twoFactorEnabled,
            readReceipts: privacySettings.readReceipts,
            dataSharing,
            profileVisibility: privacySettings.showProfile
          })
        });

        const data = await response.json();

        if (data.success) {
          alert('Settings saved successfully!');
          setIsEditing(false);
          await fetchSecurityData(); // Refresh data
        } else {
          alert(data.message || 'Failed to save settings');
        }
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleLogoutAllSessions = async () => {
    if (confirm("Are you sure you want to logout from all devices?")) {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/sessions/revoke-all`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          await fetchSecurityData();
        }
      } catch (error) {
        console.error('Error logging out sessions:', error);
      }
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchSecurityData();
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Good";
    if (passwordStrength < 100) return "Strong";
    return "Very Strong";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl
          transition-all duration-300 ease-in-out dark:bg-neutral-900
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security & Privacy
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Protect your account and data
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              <Edit2 className="h-4 w-4" />
              Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Password Change Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Password Security
              </h3>
              {isEditing && (
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Changes require verification
                </span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                    <Key className="h-4 w-4" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                    <Lock className="h-4 w-4" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-neutral-400">
                          Password strength:
                        </span>
                        <span className={`font-medium ${passwordStrength < 50 ? "text-red-600" :
                            passwordStrength < 75 ? "text-yellow-600" :
                              "text-green-600"
                          }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                        <div
                          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-neutral-400">
                        <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? "text-green-600" : ""}`}>
                          {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                        </li>
                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? "text-green-600" : ""}`}>
                          {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${/[0-9]/.test(newPassword) ? "text-green-600" : ""}`}>
                          {/[0-9]/.test(newPassword) ? "✓" : "○"} One number
                        </li>
                        <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}`}>
                          {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} One special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      Click "Edit Settings" to change your password
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Secure
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              {isEditing ? (
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative h-6 w-12 rounded-full transition-colors ${twoFactorEnabled
                      ? "bg-green-500 dark:bg-green-600"
                      : "bg-gray-300 dark:bg-neutral-600"
                    }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${twoFactorEnabled ? "left-1 translate-x-7" : "left-1"
                      }`}
                  />
                </button>
              ) : (
                <span className={`rounded-full px-3 py-1 text-sm ${twoFactorEnabled
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    Add an extra layer of security to your account
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Requires a verification code from your authenticator app when logging in
                  </p>
                  {isEditing && twoFactorEnabled && (
                    <button className="mt-3 text-sm text-[#3D3066] dark:text-[#8B7FA8]">
                      Manage authenticator apps →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Privacy Settings
            </h3>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
              {/* Profile Visibility */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                  <User className="h-4 w-4" />
                  Profile Visibility
                </label>
                {isEditing ? (
                  <select
                    value={privacySettings.showProfile}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      showProfile: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="public">Everyone</option>
                    <option value="contacts">My Contacts Only</option>
                    <option value="none">Nobody</option>
                  </select>
                ) : (
                  <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 dark:bg-neutral-700 dark:text-white">
                    {privacySettings.showProfile === "public" ? "Everyone" :
                      privacySettings.showProfile === "contacts" ? "My Contacts Only" : "Nobody"}
                  </div>
                )}
              </div>

              {/* Read Receipts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white">Read Receipts</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Let others know when you've read their messages
                  </p>
                </div>
                {isEditing ? (
                  <button
                    onClick={() => setPrivacySettings(prev => ({
                      ...prev,
                      readReceipts: !prev.readReceipts
                    }))}
                    className={`relative h-6 w-12 rounded-full transition-colors ${privacySettings.readReceipts
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                      }`}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${privacySettings.readReceipts ? "left-1 translate-x-7" : "left-1"
                        }`}
                    />
                  </button>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-sm ${privacySettings.readReceipts
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300"
                    }`}>
                    {privacySettings.readReceipts ? "On" : "Off"}
                  </span>
                )}
              </div>

              {/* Data Sharing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white">Data Sharing</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Share anonymous usage data to improve services
                  </p>
                </div>
                {isEditing ? (
                  <button
                    onClick={() => setDataSharing(!dataSharing)}
                    className={`relative h-6 w-12 rounded-full transition-colors ${dataSharing
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                      }`}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${dataSharing ? "left-1 translate-x-7" : "left-1"
                        }`}
                    />
                  </button>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-sm ${dataSharing
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300"
                    }`}>
                    {dataSharing ? "Enabled" : "Disabled"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Sessions
              </h3>
              <button
                onClick={handleLogoutAllSessions}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <RefreshCw className="h-4 w-4" />
                Logout All
              </button>
            </div>

            <div className="space-y-3">
              {securityActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${activity.status === "active"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-gray-100 dark:bg-neutral-800"
                      }`}>
                      <Smartphone className={`h-4 w-4 ${activity.status === "active"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-neutral-400"
                        }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.device}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                        <span>{activity.location}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                        {activity.status === "active" && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                              Active
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {activity.status === "active" && (
                    <button
                      onClick={() => handleRevokeSession(activity.id)}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          {!isEditing && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300">
                    Security Tips
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>• Use a unique password for this account</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Review active sessions regularly</li>
                    <li>• Keep your recovery email updated</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message for Changes */}
          {isEditing && (
            <div className="mt-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Important:</strong> Changing security settings may log you out from some devices.
                    Make sure you have access to your recovery email and phone number.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}