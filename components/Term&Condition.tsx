"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Check, X, AlertCircle, ExternalLink } from "lucide-react";

interface TermsConditionsPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function TermsConditionsPage({ user, onClose, isOpen }: TermsConditionsPageProps) {
  const [accepted, setAccepted] = useState(false);
  const [showAcceptance, setShowAcceptance] = useState(false);

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

  const handleAccept = () => {
    // Here you would typically save acceptance to backend
    console.log("Terms & Conditions accepted by user:", user?.id);
    setAccepted(true);
    setShowAcceptance(false);

    // Show success message
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleDecline = () => {
    setShowAcceptance(false);
  };

  const handleDownload = () => {
    // Create a blob with terms content
    const termsContent = document.querySelector('.terms-content')?.textContent || '';
    const blob = new Blob([termsContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AT-Plus-Jewellers-Terms-Conditions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
                Terms & Conditions
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Download terms"
            >
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Acceptance Status */}
          {accepted ? (
            <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Accepted on {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You have accepted our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    Please read and accept
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    You need to accept Terms & Conditions to continue
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Terms Content */}
          <div className="terms-content space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                By accessing and using AT Plus Jewellers' services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                2. Account Registration
              </h3>
              <p className="mb-2 text-gray-700 dark:text-neutral-300">
                You must provide accurate, current, and complete information during registration and keep your account information updated.
              </p>
              <ul className="ml-4 list-disc space-y-1 text-gray-700 dark:text-neutral-300">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One account per individual is allowed</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                3. Purchases and Payments
              </h3>
              <p className="mb-2 text-gray-700 dark:text-neutral-300">
                All purchases are subject to availability and confirmation of the order price. We reserve the right to refuse any order.
              </p>
              <ul className="ml-4 list-disc space-y-1 text-gray-700 dark:text-neutral-300">
                <li>Prices are subject to change without notice</li>
                <li>Payment must be completed before order processing</li>
                <li>All transactions are in INR (Indian Rupees)</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                4. Returns and Refunds
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                Returns are accepted within 30 days of purchase. Items must be in original condition with all tags and certificates. Customized items are non-returnable.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                5. Intellectual Property
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                All content on our platform, including text, graphics, logos, and images, is the property of AT Plus Jewellers and protected by copyright laws.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                6. Limitation of Liability
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                AT Plus Jewellers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                7. Governing Law
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                8. Changes to Terms
              </h3>
              <p className="text-gray-700 dark:text-neutral-300">
                We reserve the right to modify these terms at any time. We will notify users of any changes. Continued use of our services after changes constitutes acceptance.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
              <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Contact Information</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                For questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-neutral-300">
                Email: legal@atplusjewellers.com<br />
                Phone: 1800-XXX-XXXX<br />
                Address: AT Plus Jewellers, Mumbai, India
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!accepted && (
            <div className="mt-8 space-y-4">
              <button
                onClick={() => setShowAcceptance(true)}
                className="w-full rounded-lg bg-[#3D3066] py-3 font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
              >
                Accept Terms & Conditions
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                I'll Read Later
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Acceptance Confirmation Modal */}
      {showAcceptance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-50 p-6 shadow-xl dark:bg-neutral-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Acceptance
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Please read carefully before accepting
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 text-green-600" />
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  I have read and understood the Terms & Conditions
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 text-green-600" />
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  I agree to be legally bound by these terms
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 text-green-600" />
                <p className="text-sm text-gray-700 dark:text-neutral-300">
                  I confirm I am at least 18 years old
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 rounded-lg bg-[#3D3066] py-3 font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}