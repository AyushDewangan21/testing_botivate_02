"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, User, ExternalLink, Download, Printer } from "lucide-react";

interface PrivacyPolicyPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function PrivacyPolicyPage({ user, onClose, isOpen }: PrivacyPolicyPageProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [lastViewed, setLastViewed] = useState<string>("");

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

  // Update last viewed time
  useEffect(() => {
    if (isOpen) {
      setLastViewed(new Date().toLocaleDateString());
    }
  }, [isOpen]);

  const handleDownload = () => {
    const privacyContent = document.querySelector('.privacy-content')?.textContent || '';
    const blob = new Blob([privacyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AT-Plus-Jewellers-Privacy-Policy.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: "overview", title: "Overview", icon: <Shield className="h-4 w-4" /> },
    { id: "data-collection", title: "Data Collection", icon: <Database className="h-4 w-4" /> },
    { id: "data-usage", title: "Data Usage", icon: <Eye className="h-4 w-4" /> },
    { id: "data-protection", title: "Data Protection", icon: <Lock className="h-4 w-4" /> },
    { id: "user-rights", title: "Your Rights", icon: <User className="h-4 w-4" /> },
    { id: "cookies", title: "Cookies", icon: <Bell className="h-4 w-4" /> },
  ];

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
                Privacy Policy
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Effective: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Print policy"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Download policy"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Navigation Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeSection === section.id
                      ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Last Viewed */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Last Viewed
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {lastViewed || "First time viewing"}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                Important
              </span>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="privacy-content space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                      <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Our Commitment
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-neutral-300">
                    AT Plus Jewellers is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Scope</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Applies to all users of AT Plus Jewellers platform
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Compliance</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Compliant with Indian data protection regulations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Collection Section */}
            {activeSection === "data-collection" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Information We Collect
                  </h3>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded bg-blue-100 p-1.5 dark:bg-blue-900/30">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Personal Information</h4>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-neutral-400">
                          <li>Full name and contact details</li>
                          <li>Email address and phone number</li>
                          <li>Date of birth and gender</li>
                          <li>Government ID for KYC verification</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded bg-green-100 p-1.5 dark:bg-green-900/30">
                        <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Financial Information</h4>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-neutral-400">
                          <li>Bank account details</li>
                          <li>Payment card information (securely stored)</li>
                          <li>Transaction history</li>
                          <li>Investment preferences</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded bg-purple-100 p-1.5 dark:bg-purple-900/30">
                        <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Usage Data</h4>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-neutral-400">
                          <li>Device information and IP address</li>
                          <li>App usage patterns</li>
                          <li>Location data (with consent)</li>
                          <li>Cookies and tracking technologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Usage Section */}
            {activeSection === "data-usage" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    How We Use Your Information
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Service Provision</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        To provide, maintain, and improve our services including order processing, account management, and customer support.
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Security & Verification</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        To verify your identity, prevent fraud, detect security incidents, and protect against malicious activity.
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Communication</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        To send important notifications, updates, and marketing communications (with your consent).
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Legal Compliance</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        To comply with legal obligations, regulatory requirements, and government requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Protection Section */}
            {activeSection === "data-protection" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                      <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Security Measures
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <h4 className="font-medium text-green-800 dark:text-green-300">Encryption</h4>
                      <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                        All sensitive data is encrypted using industry-standard AES-256 encryption both in transit and at rest.
                      </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">Access Controls</h4>
                      <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                        Strict access controls and authentication mechanisms ensure only authorized personnel can access your data.
                      </p>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300">Regular Audits</h4>
                      <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
                        Regular security audits and vulnerability assessments to maintain the highest security standards.
                      </p>
                    </div>

                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Data Retention</h4>
                      <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                        We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Rights Section */}
            {activeSection === "user-rights" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Your Rights & Choices
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <div className="rounded bg-blue-100 p-1.5 dark:bg-blue-900/30">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Access & Rectification</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          Right to access your personal data and request corrections if inaccurate.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <div className="rounded bg-green-100 p-1.5 dark:bg-green-900/30">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Data Portability</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          Right to receive your data in a structured, commonly used format.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <div className="rounded bg-red-100 p-1.5 dark:bg-red-900/30">
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Right to Erasure</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          Right to request deletion of your personal data under certain circumstances.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <div className="rounded bg-purple-100 p-1.5 dark:bg-purple-900/30">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Consent Withdrawal</h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          Right to withdraw consent for data processing at any time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      To exercise any of these rights, please contact our Data Protection Officer at privacy@atplusjewellers.com
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cookies Section */}
            {activeSection === "cookies" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-5 dark:border-neutral-700">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                      <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cookies & Tracking
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        Required for basic functionality like authentication and security. Cannot be disabled.
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Analytics Cookies</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        Help us understand how users interact with our platform to improve user experience.
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Marketing Cookies</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        Used to deliver relevant advertisements and track campaign performance. You can opt-out.
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                      <h4 className="font-medium text-gray-900 dark:text-white">Cookie Management</h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        You can manage cookie preferences through your browser settings or our privacy controls.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Contact Information</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      For privacy-related inquiries or concerns:
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                      <p>Email: privacy@atplusjewellers.com</p>
                      <p>Phone: +91 22-XXXX-XXXX</p>
                      <p>Address: Data Protection Officer, AT Plus Jewellers, Mumbai</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-neutral-700">
            <p className="text-center text-sm text-gray-500 dark:text-neutral-400">
              This Privacy Policy was last updated on {new Date().toLocaleDateString()}
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}