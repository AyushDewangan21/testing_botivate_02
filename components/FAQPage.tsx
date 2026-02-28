"use client";

import { useState } from "react";
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface FAQPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

export function FAQPage({ user, onClose, isOpen }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqCategories = [
    { id: "all", name: "All Questions", count: 12 },
    { id: "account", name: "Account", count: 4 },
    { id: "transactions", name: "Transactions", count: 3 },
    { id: "security", name: "Security", count: 3 },
    { id: "kyc", name: "KYC", count: 2 },
  ];

  const faqData = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "To create an account, download the AT Plus Jewellers app from the App Store or Google Play Store. Open the app and tap on 'Sign Up'. Enter your mobile number, verify it with the OTP, and complete your profile with basic details. You'll need to complete KYC verification to access all features.",
      category: "account",
      tags: ["account", "setup"]
    },
    {
      id: 2,
      question: "What documents are required for KYC?",
      answer: "For KYC verification, you need:\n1. PAN Card (mandatory)\n2. Aadhaar Card (mandatory)\n3. Recent passport-size photograph\n4. Proof of address (if different from Aadhaar)\n\nAll documents should be clear, valid, and not expired. Ensure the name matches across all documents.",
      category: "kyc",
      tags: ["kyc", "verification", "documents"]
    },
    {
      id: 3,
      question: "How long does KYC verification take?",
      answer: "KYC verification typically takes 24-48 hours during business days. In some cases, it may take up to 72 hours. You'll receive notifications about the status of your verification. You can check your KYC status in the Profile section under 'KYC Status'.",
      category: "kyc",
      tags: ["kyc", "verification", "time"]
    },
    {
      id: 4,
      question: "How do I buy gold?",
      answer: "To buy gold:\n1. Go to the 'Buy Gold' section\n2. Choose the weight (grams) or amount (₹)\n3. Select payment method\n4. Review order details\n5. Confirm purchase\n\nYou can buy gold starting from as low as ₹100. The gold is stored securely in our vaults and allocated to your account.",
      category: "transactions",
      tags: ["buy", "gold", "purchase"]
    },
    {
      id: 5,
      question: "How do I sell gold?",
      answer: "To sell gold:\n1. Go to the 'Sell Gold' section\n2. Select the quantity you want to sell\n3. Choose bank account for payout\n4. Review current gold rate and estimated amount\n5. Confirm sale\n\nFunds are typically transferred within 24 hours to your registered bank account.",
      category: "transactions",
      tags: ["sell", "gold", "withdrawal"]
    },
    {
      id: 6,
      question: "Are there any transaction fees?",
      answer: "We charge:\n• Buying gold: 2% making charges (included in price)\n• Selling gold: 1% transaction fee\n• Storage: Free for first year, ₹99/year thereafter\n• No hidden charges\nAll fees are clearly displayed before you confirm any transaction.",
      category: "transactions",
      tags: ["fees", "charges", "cost"]
    },
    {
      id: 7,
      question: "How secure is my gold?",
      answer: "Your gold is:\n1. Insured for 100% value\n2. Stored in RBI-approved vaults\n3. Audited regularly\n4. Allocated specifically to your account\n\nWe maintain complete transparency about storage locations and insurance coverage. You can request a physical audit report.",
      category: "security",
      tags: ["security", "storage", "insurance"]
    },
    {
      id: 8,
      question: "What happens if I lose my phone?",
      answer: "If you lose your phone:\n1. Immediately contact our support team\n2. We'll temporarily freeze your account\n3. You'll need to verify identity for reactivation\n4. All sessions will be logged out\n\nEnable biometric authentication for added security. Your gold remains safe even if your phone is lost.",
      category: "security",
      tags: ["security", "lost", "phone"]
    },
    {
      id: 9,
      question: "How do I change my mobile number?",
      answer: "To change mobile number:\n1. Go to Profile → Personal Information\n2. Tap on phone number\n3. Enter new number\n4. Verify with OTP sent to new number\n5. Complete verification\n\nThis requires additional verification for security. You may need to provide supporting documents.",
      category: "account",
      tags: ["account", "mobile", "update"]
    },
    {
      id: 10,
      question: "Can I have multiple bank accounts?",
      answer: "Yes, you can add up to 3 bank accounts:\n1. Go to Profile → Bank Accounts\n2. Tap 'Add Bank Account'\n3. Enter bank details\n4. Verify with micro-deposit\n\nOnly verified bank accounts can be used for transactions. You can set one as primary for withdrawals.",
      category: "account",
      tags: ["bank", "accounts", "withdrawal"]
    },
    {
      id: 11,
      question: "Is there a minimum balance requirement?",
      answer: "No, there's no minimum balance requirement. You can start with as little as ₹100. There's no minimum holding period either - you can buy and sell as per market conditions. However, frequent trading is not recommended as gold is a long-term investment.",
      category: "account",
      tags: ["minimum", "balance", "investment"]
    },
    {
      id: 12,
      question: "How do I update my email address?",
      answer: "To update email:\n1. Go to Profile → Personal Information\n2. Tap on email address\n3. Enter new email\n4. Verify with OTP sent to new email\n\nEmail updates require verification for security. You'll receive notifications at both old and new email addresses during the transition period.",
      category: "security",
      tags: ["email", "update", "security"]
    },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaqs(prev =>
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleContactSupport = () => {
    // In a real app, this would open chat support
    window.location.href = "tel:18000000000";
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
                FAQ & Help Center
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Find answers to common questions
              </p>
            </div>
          </div>

          <div className="rounded-full bg-[#3D3066]/10 p-2 dark:bg-[#4D3F7F]/30">
            <HelpCircle className="h-6 w-6 text-[#3D3066] dark:text-[#8B7FA8]" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeCategory === category.id
                      ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    }`}
                >
                  {category.name}
                  <span className="ml-2 rounded-full bg-gray-50/20 px-2 py-0.5 text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
                <HelpCircle className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-neutral-500" />
                <p className="mb-2 text-gray-700 dark:text-neutral-300">
                  No questions found matching "{searchQuery}"
                </p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Try different keywords or contact support
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-800"
                    >
                      <div className="flex-1">
                        <span className="mb-1 inline-block rounded-full bg-[#3D3066]/10 px-3 py-1 text-xs font-medium text-[#3D3066] dark:bg-[#4D3F7F]/30 dark:text-[#8B7FA8]">
                          {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                        </span>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </h4>
                      </div>
                      {expandedFaqs.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedFaqs.includes(faq.id) && (
                      <div className="border-t border-gray-200 p-4 dark:border-neutral-700">
                        <div className="whitespace-pre-line text-gray-600 dark:text-neutral-400">
                          {faq.answer}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {faq.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-neutral-800 dark:text-neutral-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Support Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#3D3066] to-[#5C4E7F] p-6 text-white">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Still need help?</h3>
                <p className="text-sm text-white/80">
                  Our support team is available 24/7
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-white/70" />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContactSupport}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50/20 p-3 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-50/20 p-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Call Support</p>
                    <p className="text-xs text-white/70">1800-XXX-XXXX</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                onClick={handleContactSupport}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50/20 p-3 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-50/20 p-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 6h-2v9H6v2c0 .6.4 1 1 1h11l4 4V7c0-.6-.4-1-1-1zm-4 6V3c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1v14l4-4h10c.6 0 1-.4 1-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chat Support</p>
                    <p className="text-xs text-white/70">Instant messaging</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                onClick={handleContactSupport}
                className="flex w-full items-center justify-between rounded-xl bg-gray-50/20 p-3 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-50/20 p-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-white/70">support@atplusjewellers.com</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}