"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info, Download, Printer } from "lucide-react";

interface RiskDisclosurePageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function RiskDisclosurePage({ user, onClose, isOpen }: RiskDisclosurePageProps) {
  const [acknowledged, setAcknowledged] = useState(false);

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

  const handleAcknowledge = () => {
    setAcknowledged(true);
    console.log("Risk disclosure acknowledged by:", user?.id);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleDownload = () => {
    const content = `
AT PLUS JEWELLERS - RISK DISCLOSURE

1. Market Risk
Jewelry prices fluctuate based on gold/silver prices, market demand, and economic conditions.

2. Valuation Risk
Appraisal values may differ from resale/market values.

3. Storage Risk
Physical jewelry requires secure storage. We recommend insurance.

4. Liquidity Risk
Jewelry may not be instantly convertible to cash at desired prices.

5. Counterparty Risk
We are responsible for quality, certification, and authenticity.

6. Regulatory Risk
Changes in laws/taxes may affect jewelry transactions.

ACKNOWLEDGMENT
I understand and accept these risks.

Date: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AT-Plus-Jewellers-Risk-Disclosure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const risks = [
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Market Risk",
      description: "Jewelry prices fluctuate based on gold/silver market prices, demand, and economic conditions."
    },
    {
      icon: <Info className="h-5 w-5" />,
      title: "Valuation Risk",
      description: "Appraisal values may differ from actual resale/market values at time of sale."
    },
    {
      icon: <Info className="h-5 w-5" />,
      title: "Storage Risk",
      description: "Physical jewelry requires secure storage. Loss, theft, or damage risks exist."
    },
    {
      icon: <Info className="h-5 w-5" />,
      title: "Liquidity Risk",
      description: "Jewelry may not be instantly convertible to cash at desired prices."
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Counterparty Risk",
      description: "Relies on our integrity for quality, certification, and authenticity."
    },
    {
      icon: <Info className="h-5 w-5" />,
      title: "Regulatory Risk",
      description: "Changes in laws, taxes, or regulations may affect jewelry transactions."
    }
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
                Risk Disclosure
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Important - Please read carefully
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Banner */}
          <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Important Notice
                </h3>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Investing in jewelry involves risks. Please understand all risks before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgement Status */}
          {acknowledged ? (
            <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Risk Disclosure Acknowledged
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    Not Acknowledged
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Please read and acknowledge below
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Introduction */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
            <p className="text-gray-700 dark:text-neutral-300">
              This document outlines the key risks associated with purchasing, holding, and selling jewelry through AT Plus Jewellers. By using our services, you acknowledge these risks.
            </p>
          </div>

          {/* Risks List */}
          <div className="mb-6 space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${index < 2 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    <div className={index < 2 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}>
                      {risk.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {risk.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                      {risk.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <h3 className="mb-3 font-medium text-blue-800 dark:text-blue-300">
              Key Considerations
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4" />
                <span>Invest only what you can afford to hold long-term</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4" />
                <span>Get independent valuations for high-value items</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4" />
                <span>Maintain proper insurance coverage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4" />
                <span>Diversify your investments beyond jewelry</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-neutral-700">
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              This disclosure does not cover all risks. Market conditions change, and past performance doesn't guarantee future results. Consider seeking independent financial advice.
            </p>
          </div>

          {/* Action Buttons */}
          {!acknowledged && (
            <div className="space-y-3">
              <button
                onClick={handleAcknowledge}
                className="w-full rounded-lg bg-[#3D3066] py-3 font-medium text-white hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
              >
                I Understand & Accept Risks
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                I'll Read Later
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-neutral-700">
            <p className="text-center text-sm text-gray-500 dark:text-neutral-400">
              AT Plus Jewellers • Risk Disclosure v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {acknowledged && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-gray-50 p-6 shadow-xl dark:bg-neutral-800">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
              Risk Disclosure Acknowledged
            </h3>
            <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
              Thank you for reviewing and acknowledging the risks. You may now proceed with our services.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-[#3D3066] py-3 font-medium text-white hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}