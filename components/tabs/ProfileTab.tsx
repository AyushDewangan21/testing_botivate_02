"use client";

import {
  ChevronRight,
  User,
  Shield,
  Banknote,
  MapPin,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  CheckCircle,
  AlertCircle,
  Settings,
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Smartphone,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { cn } from "../ui/utils";
import { PersonalInfoPage } from "@/components/PersonalInfoPage";
import { KYCStatusPage } from "../KYCStatusPage";
import { BankAccountsPage } from "@/components/BankAccountsPage";
import { SavedAddressesPage } from "@/components/SavedAddressesPage";
import { PaymentMethodsPage } from "@/components/PaymentMethospage";
import { NotificationsPage } from "@/components/NotificationsPage";
import { LanguagesPage } from "@/components/LanguagesPage";
import { FAQPage } from "@/components/FAQPage";
import { TermsConditionsPage } from "@/components/Term&Condition";
import { PrivacyPolicyPage } from "@/components/Privacy&Policy";
import { RiskDisclosurePage } from "@/components/RiskDisclosure";
import { SecurityPrivacyPage } from "../SecurityPrivacyPage";
import { ProfileTabSkeleton } from "@/components/skeletons/ProfileTabSkeleton";
interface ProfileTabProps {
  isLoading?: boolean;
  user: any;
  onLogout: () => void;
}

export function ProfileTab({ user, onLogout, isLoading }: ProfileTabProps) {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const [kycStatus, setKycStatus] = useState<
    "verified" | "pending" | "incomplete"
  >("verified");
  const [darkMode, setDarkMode] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showKYCStatus, setShowKYCStatus] = useState(false);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showRiskDisclosure, setShowRiskDisclosure] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    transactions: true,
    marketing: false,
  });
  const [isInternalLoading, setIsInternalLoading] = useState(true);

  // Handle URL query parameter for opening payment section
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "payment") {
      setShowPaymentMethods(true);
    }
  }, [searchParams]);

  // ProfileTab has no dynamic data loading - render immediately

  const handleCallSupport = () => {
    window.location.href = "tel:+911234567890";
  };

  const handleChatSupport = () => {
    const phoneNumber = "+911234567890";
    const message = "Hello, I need support";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    // Sync with theme provider
    const isDark = theme === "dark";
    setDarkMode(isDark);

    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setDarkMode(newTheme === "dark");
  };

  const handleLogout = () => {
    onLogout();
  };

  useEffect(() => {
    if (
      showPersonalInfo ||
      showKYCStatus ||
      showBankAccounts ||
      showSavedAddresses ||
      showPaymentMethods ||
      showNotifications ||
      showLanguages ||
      showFAQ ||
      showTermsConditions ||
      showPrivacyPolicy ||
      showRiskDisclosure ||
      showPrivacySecurity
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showPersonalInfo,
    showKYCStatus,
    showBankAccounts,
    showSavedAddresses,
    showPaymentMethods,
    showNotifications,
    showLanguages,
    showFAQ,
    showTermsConditions,
    showPrivacyPolicy,
    showRiskDisclosure,
    showPrivacySecurity,
  ]);

  return (
    <>
      <div className="min-h-screen overflow-x-hidden pb-6 dark:bg-neutral-900 dark:text-gray-100">
        {/* Header */}
        <div className="rounded-b-3xl 
  bg-gradient-to-br 
  from-[#4B3B80] 
  via-[#3A2C66] 
  to-[#1F173D] 
  px-6 pt-6 pb-8
  shadow-[0_10px_40px_rgba(31,23,61,0.35)]">

          <h1 className="mb-6 text-white">Profile</h1>

          {/* User Info Card */}
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md dark:bg-white/5">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-4 dark:bg-white/10">
                <User className="h-8 w-8 text-white dark:text-white/90" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-white dark:text-white/95">
                  {user?.name || "User Name"}
                </p>
                <p className="text-sm text-white/80 dark:text-white/70">
                  {user?.phone || "+91 98765 43210"}
                </p>
              </div>
            </div>

            {/* KYC Status */}
            <div
              className={`flex items-center gap-2 rounded-lg p-3 ${kycStatus === "verified"
                ? "border border-green-300/30 bg-green-500/20 dark:border-green-700/50 dark:bg-green-900/30"
                : kycStatus === "pending"
                  ? "border border-yellow-300/30 bg-yellow-500/20 dark:border-yellow-700/50 dark:bg-yellow-900/30"
                  : "border border-red-300/30 bg-red-500/20 dark:border-red-700/50 dark:bg-red-900/30"
                }`}
            >
              {kycStatus === "verified" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-300 dark:text-green-400" />
                  <span className="text-sm text-white dark:text-white/95">
                    KYC Verified
                  </span>
                </>
              ) : kycStatus === "pending" ? (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-300 dark:text-yellow-400" />
                  <span className="text-sm text-white dark:text-white/95">
                    KYC Under Review
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-300 dark:text-red-400" />
                  <span className="text-sm text-white dark:text-white/95">
                    KYC Not Complete
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 px-6">
          {/* Account Section */}
          <div
            className={cn(
              "mb-4 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-neutral-700/50 dark:shadow-neutral-900/50",
            )}
          >
            <div className="border-b border-gray-100 p-4 dark:border-neutral-700">
              <h3 className="text-black dark:text-white">Account</h3>
            </div>
            <div>
              {/* Personal Information Button */}
              <button
                onClick={() => setShowPersonalInfo(true)}
                className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Personal Information
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>

              {/* KYC Status Button - Updated */}
              <button
                onClick={() => setShowKYCStatus(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white">
                      KYC Status
                    </span>
                    {kycStatus === "verified" && (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Verified
                      </span>
                    )}
                    {kycStatus === "pending" && (
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                        Pending
                      </span>
                    )}
                    {kycStatus === "incomplete" && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        Incomplete
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={() => setShowBankAccounts(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Bank Accounts
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={() => setShowSavedAddresses(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Saved Addresses
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={() => setShowPaymentMethods(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Payment Methods
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
            <div className="border-b border-gray-100 p-4 dark:border-neutral-700">
              <h3 className="text-black dark:text-white">Settings</h3>
            </div>
            <div>
              {/* Dark Mode Toggle */}
              <div className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  )}
                  <span className="text-gray-900 dark:text-white">
                    Dark Mode
                  </span>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`relative h-6 w-12 rounded-full transition-colors ${darkMode
                    ? "bg-[#8b6fee] dark:bg-[#8b6fee]"
                    : "bg-gray-300 dark:bg-neutral-600"
                    }`}
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${darkMode ? "left-1 translate-x-7" : "left-1"
                      }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Notifications
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>

              {/* Security */}
              <button
                onClick={() => setShowPrivacySecurity(true)}
                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Security & Privacy
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>

              {/* Language */}
              <button
                onClick={() => setShowLanguages(true)}
                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Languages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    English
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                </div>
              </button>

              {/* Biometric */}
              {/* <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Biometric Lock
                  </span>
                </div>
                <button
                  className="relative h-6 w-12 rounded-full bg-[#3D3066] transition-colors dark:bg-[#4D3F7F]"
                  aria-label="Toggle biometric lock"
                >
                  <div className="absolute top-1 left-1 h-4 w-4 translate-x-7 rounded-full bg-white transition-transform" />
                </button>
              </div> */}
            </div>
          </div>

          {/* Help & Support Section */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
            <div className="border-b border-gray-100 p-4 dark:border-neutral-700">
              <h3 className="text-black dark:text-white">Help & Support</h3>
            </div>
            <div>
              <button
                onClick={() => setShowFAQ(true)}
                className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">FAQ</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={handleChatSupport}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Chat Support
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={handleCallSupport}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Call Support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    1800-XXX-XXXX
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                </div>
              </button>
            </div>
          </div>

          {/* Legal Section */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
            <div className="border-b border-gray-100 p-4 dark:border-neutral-700">
              <h3 className="text-black dark:text-white">Legal</h3>
            </div>
            <div>
              <button
                onClick={() => setShowTermsConditions(true)}
                className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Terms & Conditions
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
              <button
                onClick={() => setShowRiskDisclosure(true)}
                className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                  <span className="text-gray-900 dark:text-white">
                    Risk Disclosure
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="mb-4 rounded-2xl bg-white p-4 dark:bg-neutral-800 dark:shadow-neutral-900/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-neutral-400">
                App Version
              </span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-4 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>

          {/* Powered By */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-500">
            <p>Powered by AT Plus Jewellers</p>
          </div>
        </div>
      </div>

      {/* Personal Information Page */}
      {showPersonalInfo && (
        <PersonalInfoPage
          user={user}
          isOpen={showPersonalInfo}
          onClose={() => setShowPersonalInfo(false)}
        />
      )}

      {/* KYC Status Page */}
      {showKYCStatus && (
        <KYCStatusPage
          user={user}
          isOpen={showKYCStatus}
          onClose={() => setShowKYCStatus(false)}
          currentStatus={kycStatus}
        />
      )}

      {/* Bank Accounts Page */}
      {showBankAccounts && (
        <BankAccountsPage
          user={user}
          isOpen={showBankAccounts}
          onClose={() => setShowBankAccounts(false)}
        />
      )}

      {/* Saved Address Page */}
      {showSavedAddresses && (
        <SavedAddressesPage
          user={user}
          isOpen={showSavedAddresses}
          onClose={() => setShowSavedAddresses(false)}
        />
      )}

      {/* Payment Methods Page */}
      {showPaymentMethods && (
        <PaymentMethodsPage
          user={user}
          isOpen={showPaymentMethods}
          onClose={() => setShowPaymentMethods(false)}
        />
      )}

      {/* Notifications Page */}
      {showNotifications && (
        <NotificationsPage
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Languages Page */}
      {showLanguages && (
        <LanguagesPage
          user={user}
          isOpen={showLanguages}
          onClose={() => setShowLanguages(false)}
        />
      )}

      {/* FAQ Page */}
      {showFAQ && (
        <FAQPage
          user={user}
          isOpen={showFAQ}
          onClose={() => setShowFAQ(false)}
        />
      )}

      {/* Terms & Conditions Page */}
      {showTermsConditions && (
        <TermsConditionsPage
          user={user}
          isOpen={showTermsConditions}
          onClose={() => setShowTermsConditions(false)}
        />
      )}

      {/* Privacy & Policy Page */}
      {showPrivacyPolicy && (
        <PrivacyPolicyPage
          user={user}
          isOpen={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        />
      )}

      {/* Risk Disclosure Page */}
      {showRiskDisclosure && (
        <RiskDisclosurePage
          user={user}
          isOpen={showRiskDisclosure}
          onClose={() => setShowRiskDisclosure(false)}
        />
      )}

      {/* Privacy Security Page */}
      {showPrivacySecurity && (
        <SecurityPrivacyPage
          user={user}
          isOpen={showPrivacySecurity}
          onClose={() => setShowPrivacySecurity(false)}
        />
      )}
    </>
  );
}
