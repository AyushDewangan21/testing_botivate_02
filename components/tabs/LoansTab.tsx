import { useEffect, useState } from "react";
import {
  Banknote,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Coins,
  ChevronRight,
  Info,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import { ZoldLogoHorizontal } from "@/components/ZoldLogo";
import { LoansTabSkeleton } from "@/components/skeletons/LoansTabSkeleton";

interface LoansTabProps {
  onOpenApplyLoan: () => void;
  onOpenApplyLoanpage: () => void;
  onOpenPartners: () => void;
  isLoading: boolean;
}

export function LoansTab({ onOpenApplyLoan, onOpenApplyLoanpage, onOpenPartners, isLoading }: LoansTabProps) {
  const [selectedTab, setSelectedTab] = useState<"overview" | "active">(
    "overview",
  );
  const [isInternalLoading, setIsInternalLoading] = useState(true);

  const eligibleGold = 10.547;
  const maxLoanAmount = 47463; // 75% LTV at 6000/gm
  const interestRate = 9.5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInternalLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadDocument = (docName: string) => {
    alert(`Downloading ${docName}...`);
  };

  const activeLoans = [
    {
      id: 1,
      principal: 20000,
      interest: 9.5,
      tenure: 6,
      startDate: "2025-11-28",
      dueDate: "2026-05-28",
      pledgedGold: 2.0,
      outstanding: 19500,
      nextEMI: 3425,
      nextEMIDate: "2026-01-01",
      status: "active",
    },
  ];

  if (isLoading || isInternalLoading) {
    return <LoansTabSkeleton />;
  }

  return (
    <div className="min-h-screen pb-6 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <div className="rounded-b-3xl bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] px-6 pt-6 pb-8">
        <img src="02.png" alt="Zold Logo" className="h-16 rounded-xl mb-4" />

        {/* Hero Banner */}
        <div className="rounded-2xl bg-gray-50/10 p-6 backdrop-blur-md dark:bg-gray-50/5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm text-white/90 dark:text-white/80">
                Get instant loan on your gold
              </p>
              <p className="mb-1 text-white dark:text-white/95">
                Up to ₹{maxLoanAmount.toLocaleString()}
              </p>
              <p className="text-sm text-white/80 dark:text-white/70">
                Based on {eligibleGold} gm available
              </p>
            </div>
            <Banknote className="h-12 w-12 text-white/80" />
          </div>
          <div className="rounded-lg bg-gray-50/20 p-3 dark:bg-gray-50/10">
            <p className="mb-1 text-xs text-white/90 dark:text-white/80">
              Interest Rate
            </p>
            <p className="text-white dark:text-white/95">
              {interestRate}% p.a.
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-4 px-6 ">
        {/* Tab Selector */}
        <div className="mb-6 flex rounded-xl bg-gray-50 p-1 shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`flex-1 rounded-lg py-2 transition-colors ${selectedTab === "overview"
              ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
              : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("active")}
            className={`relative flex-1 rounded-lg py-2 transition-colors ${selectedTab === "active"
              ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
              : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
              }`}
          >
            Active Loans
            {activeLoans.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {activeLoans.length}
              </span>
            )}
          </button>
        </div>

        {selectedTab === "overview" && (
          <div className="space-y-6">
            {/* Apply Options */}
            <div>
              <h2 className="mb-4 text-black dark:text-white">
                Apply for Loan
              </h2>
              <div className="space-y-3">
                {/* Online Loan */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:border-[#8B7FA8] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                        <h3 className="text-black dark:text-white">
                          Online Loan
                        </h3>
                      </div>
                      <p className="mb-3 text-sm text-gray-600 dark:text-neutral-400">
                        Get instant approval and disbursement
                      </p>
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Processing Time
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            Instant
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Max Amount
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            ₹50,000
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Interest Rate
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {interestRate}% p.a.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={onOpenApplyLoan} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3D3066] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
                    Apply Now
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Partner Store Loan */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-colors hover:border-[#8B7FA8] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <h3 className="text-black dark:text-white">
                          Visit Partner Store
                        </h3>
                      </div>
                      <p className="mb-3 text-sm text-gray-600 dark:text-neutral-400">
                        Get higher loan amounts with partner assistance
                      </p>
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Processing Time
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            Same Day
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Max Amount
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            No Limit
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-neutral-400">
                            Interest Rate
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {interestRate - 0.5}% p.a.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenPartners} // Directly use the prop
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                  >
                    Find Nearby Partners
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loan Calculator */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-4 text-black dark:text-white">
                Loan Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                    Gold to Pledge (grams)
                  </label>
                  <input
                    type="number"
                    defaultValue="5.0"
                    step="0.1"
                    max={eligibleGold}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:ring-[#8B7FA8]"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                    Max available: {eligibleGold} gm
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                    Loan Tenure
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:ring-[#8B7FA8]">
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>

                <div className="space-y-2 rounded-lg bg-[#F3F1F7] p-4 dark:bg-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Eligible Loan Amount
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹22,500
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Monthly EMI
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹3,850
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Total Interest
                    </span>
                    <span className="text-gray-900 dark:text-white">₹600</span>
                  </div>
                </div>

                <button onClick={onOpenApplyLoan} className="w-full rounded-lg bg-[#3D3066] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
                  Apply for This Loan
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="mb-2 text-blue-900 dark:text-blue-300">
                    How Gold Loans Work
                  </p>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                    <li>• Your pledged gold is stored securely</li>
                    <li>• Get up to 75% of gold value as loan</li>
                    <li>• Flexible repayment options available</li>
                    <li>• Get your gold back after full repayment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "active" && (
          <div className="space-y-4">
            {activeLoans.length > 0 ? (
              activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-black dark:text-white">
                        Loan #{loan.id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-500">
                        Started on {loan.startDate}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Active
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                      <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                        Principal Amount
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        ₹{loan.principal.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                      <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                        Outstanding
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        ₹{loan.outstanding.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                      <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                        Pledged Gold
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {loan.pledgedGold} gm
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                      <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                        Interest Rate
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {loan.interest}% p.a.
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg border border-[#E5E1F0] bg-[#F3F1F7] p-4 dark:border-neutral-600 dark:bg-neutral-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                      <p className="text-[#3D3066] dark:text-[#8B7FA8]">
                        Next EMI Due
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5C4E7F] dark:text-neutral-400">
                        {loan.nextEMIDate}
                      </span>
                      <span className="text-[#3D3066] dark:text-[#8B7FA8]">
                        ₹{loan.nextEMI.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 rounded-lg bg-[#3D3066] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
                      Pay EMI
                    </button>
                    <button className="flex-1 rounded-lg border border-gray-300 bg-gray-50 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                      View Details
                    </button>
                  </div>

                  {/* Documents */}
                  <div className="mt-4 border-t border-gray-100 pt-3 dark:border-neutral-700">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase">Documents</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadDocument("Loan Agreement")}
                        className="flex items-center gap-1 text-xs text-[#3D3066] hover:underline dark:text-[#8B7FA8]"
                      >
                        <FileText className="h-3 w-3" />
                        Loan Agreement
                      </button>
                      <button
                        onClick={() => handleDownloadDocument("Key Fact Statement (KFS)")}
                        className="flex items-center gap-1 text-xs text-[#3D3066] hover:underline dark:text-[#8B7FA8]"
                      >
                        <Download className="h-3 w-3" />
                        KFS
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-neutral-800">
                <Banknote className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-neutral-600" />
                <p className="mb-2 text-gray-900 dark:text-white">
                  No Active Loans
                </p>
                <p className="mb-6 text-sm text-gray-500 dark:text-neutral-500">
                  You don't have any active loans at the moment
                </p>
                <button
                  onClick={() => setSelectedTab("overview")}
                  className="rounded-lg bg-[#3D3066] px-6 py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]"
                >
                  Apply for a Loan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
