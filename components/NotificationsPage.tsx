"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Mail,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign,
  TrendingUp,
  Shield,
  X,
  Trash2,
  Filter,
  Eye,
  EyeOff,
  Clock,
  Settings,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "transaction" | "security" | "marketing" | "system" | "price";
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
  action?: string;
}

interface NotificationsPageProps {
  onClose: () => void;
  isOpen: boolean;
}

export function NotificationsPage({ onClose, isOpen }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Gold Purchase Successful",
      message: "Your purchase of 5g gold has been completed successfully.",
      type: "transaction",
      timestamp: "2 mins ago",
      read: false,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      action: "View Details"
    },
    {
      id: "2",
      title: "Price Alert Triggered",
      message: "Gold price reached ₹6,500/g. Check current rates.",
      type: "price",
      timestamp: "1 hour ago",
      read: false,
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      action: "View Rates"
    },
    {
      id: "3",
      title: "Security Alert",
      message: "New login detected from Delhi. If this wasn't you, secure your account.",
      type: "security",
      timestamp: "3 hours ago",
      read: true,
      icon: <Shield className="h-5 w-5 text-red-600" />,
      action: "Review Activity"
    },
    {
      id: "4",
      title: "Transaction Update",
      message: "Your gold conversion request at AT Plus Jewellers is being processed.",
      type: "transaction",
      timestamp: "Yesterday",
      read: true,
      icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
      action: "Track Order"
    },
    {
      id: "5",
      title: "New Offers Available",
      message: "Exclusive discounts on jewellery conversion this weekend.",
      type: "marketing",
      timestamp: "2 days ago",
      read: true,
      icon: <DollarSign className="h-5 w-5 text-orange-600" />,
      action: "View Offers"
    },
    {
      id: "6",
      title: "System Maintenance",
      message: "Scheduled maintenance on Saturday 2AM-4AM. Service may be interrupted.",
      type: "system",
      timestamp: "3 days ago",
      read: true,
      icon: <Info className="h-5 w-5 text-gray-600" />,
    },
    {
      id: "7",
      title: "Payment Received",
      message: "₹25,000 received for gold sale. Amount credited to your bank account.",
      type: "transaction",
      timestamp: "1 week ago",
      read: true,
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      action: "View Receipt"
    },
    {
      id: "8",
      title: "KYC Verification Complete",
      message: "Your KYC documents have been verified successfully.",
      type: "security",
      timestamp: "1 week ago",
      read: true,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "transaction" | "price" | "security">("all");
  const [notificationSettings, setNotificationSettings] = useState({
    priceAlerts: true,
    transactions: true,
    marketing: false,
    security: true,
    system: true,
    push: true,
    email: true,
    sms: false,
  });

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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "transaction":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "marketing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "system":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "price":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "transaction":
        return "Transaction";
      case "security":
        return "Security";
      case "marketing":
        return "Marketing";
      case "system":
        return "System";
      case "price":
        return "Price Alert";
      default:
        return type;
    }
  };

  const handleNotificationSettingChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
                Notifications
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {notifications.filter(n => !n.read).length} unread
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#3D3066] hover:bg-gray-100 dark:text-[#8B7FA8] dark:hover:bg-neutral-800"
              disabled={notifications.filter(n => !n.read).length === 0}
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              disabled={notifications.length === 0}
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">Filter by</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${filter === "all"
                  ? "bg-[#3D3066] text-white dark:bg-[#8B7FA8]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${filter === "unread"
                  ? "bg-[#3D3066] text-white dark:bg-[#8B7FA8]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
              >
                Unread ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={() => setFilter("transaction")}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${filter === "transaction"
                  ? "bg-[#3D3066] text-white dark:bg-[#8B7FA8]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setFilter("price")}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${filter === "price"
                  ? "bg-[#3D3066] text-white dark:bg-[#8B7FA8]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
              >
                Price Alerts
              </button>
              <button
                onClick={() => setFilter("security")}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${filter === "security"
                  ? "bg-[#3D3066] text-white dark:bg-[#8B7FA8]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
              >
                Security
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-700">
                <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
                <p className="mt-2 text-gray-600 dark:text-neutral-400">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"
                  }
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Your notifications will appear here"
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 transition-all ${notification.read
                    ? "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50"
                    : "border-[#3D3066] bg-[#3D3066]/5 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notification.icon}
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getNotificationTypeColor(notification.type)}`}>
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-500">
                              <Clock className="h-3 w-3" />
                              {notification.timestamp}
                            </span>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-neutral-700"
                              title="Mark as read"
                            >
                              <EyeOff className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4 text-red-400 dark:text-red-400" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-3 text-gray-700 dark:text-neutral-300">
                        {notification.message}
                      </p>

                      {notification.action && (
                        <button className="text-sm font-medium text-[#3D3066] hover:text-[#5C4E7F] dark:text-[#8B7FA8] dark:hover:text-[#A59BC0]">
                          {notification.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Settings */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                <Settings className="h-4 w-4" />
                Notification Settings
              </h3>
              <button
                onClick={() => {
                  // In a real app, this would save to backend
                  alert("Settings saved successfully!");
                }}
                className="rounded-lg bg-[#3D3066] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
              >
                Save Changes
              </button>
            </div>

            <div className="space-y-4">
              {/* Notification Types */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Notification Types
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">Price Alerts</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("priceAlerts")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.priceAlerts
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.priceAlerts ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <span className="text-gray-900 dark:text-white">Transaction Updates</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("transactions")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.transactions
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.transactions ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span className="text-gray-900 dark:text-white">Security Alerts</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("security")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.security
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.security ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <span className="text-gray-900 dark:text-white">Marketing & Offers</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("marketing")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.marketing
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.marketing ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">System Updates</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("system")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.system
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.system ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Methods */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Delivery Methods
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-900 dark:text-white">Push Notifications</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("push")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.push
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.push ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">Email Notifications</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("email")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.email
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.email ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-green-500" />
                      <span className="text-gray-900 dark:text-white">SMS Alerts</span>
                    </div>
                    <button
                      onClick={() => handleNotificationSettingChange("sms")}
                      className={`relative h-6 w-12 rounded-full transition-colors ${notificationSettings.sms
                        ? "bg-[#3D3066] dark:bg-[#4D3F7F]"
                        : "bg-gray-300 dark:bg-neutral-600"
                        }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-gray-50 transition-transform ${notificationSettings.sms ? "left-1 translate-x-7" : "left-1"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Security alerts are always enabled for your protection and cannot be disabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}