import { useState } from "react";
import { X, Calculator, TrendingUp, ChevronRight, Info, AlertCircle, Banknote, Coins } from "lucide-react"; // Import Banknote/Coins for header icon

export function ApplyLoan({ isOpen, onClose, eligibleGold, maxLoanAmount, interestRate }: {
    isOpen: boolean;
    onClose: () => void;
    eligibleGold: number;
    maxLoanAmount: number;
    interestRate: number;
}) {
    const [selectedOption, setSelectedOption] = useState<"online" | "partner">("online");
    const [goldAmount, setGoldAmount] = useState<number>(5.0);
    const [tenure, setTenure] = useState<number>(6);

    if (!isOpen) return null;

    // Calculate loan details
    const goldPricePerGm = 6000; // Assuming 6000/gm
    const eligibleLoanAmount = Math.min(
        goldAmount * goldPricePerGm * 0.75,
        maxLoanAmount
    );
    const monthlyInterestRate = interestRate / 12 / 100;
    const emi = eligibleLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure) /
        (Math.pow(1 + monthlyInterestRate, tenure) - 1);
    const totalInterest = emi * tenure - eligibleLoanAmount;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 dark:bg-black/70">
            <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
            <div className="zold-hide-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-gray-50 dark:bg-neutral-800">
                {/* Header - Stolen from GiftGold style but with Loan branding */}
                <div className="sticky top-0 z-10 rounded-t-3xl bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm">
                                <Banknote className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white">Apply for Gold Loan</h2>
                                <p className="text-sm text-white/80">
                                    Get instant loan against your gold
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Loan Options */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-gray-900 dark:text-white">Select Loan Type</h3>
                        <div className="space-y-3">
                            {/* Online Loan Option */}
                            <button
                                onClick={() => setSelectedOption("online")}
                                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedOption === "online"
                                    ? "border-[#3D3066] bg-[#F3F1F7] dark:border-[#8B7FA8] dark:bg-neutral-700"
                                    : "border-gray-200 hover:border-[#8B7FA8] dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                                            <span className="font-medium text-black dark:text-white">
                                                Online Loan
                                            </span>
                                        </div>
                                        <p className="mb-3 text-sm text-gray-600 dark:text-neutral-400">
                                            Instant approval and disbursement
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-neutral-400">
                                                    Max Amount
                                                </span>
                                                <span className="text-black dark:text-white">₹50,000</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-neutral-400">
                                                    Interest Rate
                                                </span>
                                                <span className="text-black dark:text-white">{interestRate}% p.a.</span>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedOption === "online" && (
                                        <div className="ml-2 h-5 w-5 rounded-full border-4 border-[#3D3066] dark:border-[#8B7FA8]" />
                                    )}
                                </div>
                            </button>


                        </div>
                    </div>

                    {/* Loan Calculator */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-gray-900 dark:text-white">Loan Calculator</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    Gold to Pledge (grams)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={goldAmount}
                                        onChange={(e) => setGoldAmount(parseFloat(e.target.value) || 0)}
                                        step="0.1"
                                        min="0.1"
                                        max={eligibleGold}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black focus:border-[#3D3066] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:border-[#8B7FA8]"
                                    />
                                    <div className="absolute right-3 top-3 text-sm text-gray-500 dark:text-neutral-400">
                                        gm
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                    Max available: {eligibleGold} gm
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    Loan Tenure
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {[3, 6, 9, 12].map((months) => (
                                        <button
                                            key={months}
                                            onClick={() => setTenure(months)}
                                            className={`rounded-xl py-3 text-sm transition-all ${tenure === months
                                                ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
                                                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                                }`}
                                        >
                                            {months} months
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Loan Summary */}
                            <div className="rounded-2xl bg-gradient-to-br from-[#F3F1F7] to-[#E5E1F0] p-6 dark:from-neutral-700 dark:to-neutral-800">
                                <h4 className="mb-4 text-black dark:text-white font-medium">Loan Summary</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-neutral-400">Gold Value</span>
                                        <span className="text-black dark:text-white">
                                            ₹{(goldAmount * goldPricePerGm).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-neutral-400">Loan Amount</span>
                                        <span className="text-lg font-semibold text-[#3D3066] dark:text-[#8B7FA8]">
                                            ₹{eligibleLoanAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-neutral-400">Monthly EMI</span>
                                        <span className="text-black dark:text-white">
                                            ₹{emi.toFixed(0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-neutral-400">Total Interest</span>
                                        <span className="text-black dark:text-white">
                                            ₹{totalInterest.toFixed(0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-300 pt-3 dark:border-neutral-600">
                                        <span className="font-medium text-gray-700 dark:text-neutral-300">
                                            Total Payment
                                        </span>
                                        <span className="font-semibold text-black dark:text-white">
                                            ₹{(eligibleLoanAmount + totalInterest).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div className="text-sm">
                                <p className="mb-1 font-medium text-blue-900 dark:text-blue-300">
                                    Important Information
                                </p>
                                <ul className="space-y-1 text-blue-800 dark:text-blue-300">
                                    <li>• Gold valuation is based on current market rates</li>
                                    <li>• 75% of gold value is provided as loan</li>
                                    <li>• Gold is stored in secure vaults with insurance</li>
                                    <li>• Early repayment options available</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 dark:bg-neutral-700 py-4 text-gray-700 dark:text-neutral-300 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                // Handle loan application submission
                                alert(`Loan application submitted for ₹${eligibleLoanAmount.toLocaleString()}`);
                                onClose();
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D3066] dark:bg-[#4D3F7F] py-4 text-white transition-colors hover:bg-[#5C4E7F] dark:hover:bg-[#5C4E9F]"
                        >
                            <span>Submit Application</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}