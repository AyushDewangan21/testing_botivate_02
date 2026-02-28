import { Calendar, CheckCircle, Info } from "lucide-react";

interface ApplyLoanPageProps {
  onBack: () => void;
  loanAmount: number;
  goldPledged: number;
  tenureMonths: number;
  interestRate: number;
}

export function ApplyLoanPage({
  onBack,
  loanAmount,
  goldPledged,
  tenureMonths,
  interestRate,
}: ApplyLoanPageProps) {
  const monthlyEMI = Math.round(
    (loanAmount + (loanAmount * interestRate * tenureMonths) / 1200) /
    tenureMonths
  );

  return (
    <div className="min-h-screen pb-6 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <div className="rounded-b-3xl bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] px-6 pt-6 pb-8">
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 rounded-full p-2 hover:bg-gray-50/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-white">Apply for Loan</h1>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl bg-gray-50/10 p-6 backdrop-blur-md dark:bg-gray-50/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm text-white/90 dark:text-white/80">
                Your Loan Summary
              </p>
              <p className="text-2xl font-semibold text-white dark:text-white/95">
                ₹{loanAmount.toLocaleString()}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-white/80" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80 dark:text-white/70">
                Gold Pledged
              </span>
              <span className="text-white dark:text-white/95">
                {goldPledged} gm
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80 dark:text-white/70">
                Tenure
              </span>
              <span className="text-white dark:text-white/95">
                {tenureMonths} months
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80 dark:text-white/70">
                Interest Rate
              </span>
              <span className="text-white dark:text-white/95">
                {interestRate}% p.a.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* Loan Details */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-black dark:text-white">Loan Details</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-neutral-400">
                Principal Amount
              </span>
              <span className="text-gray-900 dark:text-white">
                ₹{loanAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-neutral-400">
                Total Interest ({tenureMonths} months)
              </span>
              <span className="text-gray-900 dark:text-white">
                ₹{Math.round((loanAmount * interestRate * tenureMonths) / 1200).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-neutral-400">
                Total Payable Amount
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{(loanAmount + (loanAmount * interestRate * tenureMonths) / 1200).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* EMI Schedule */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-black dark:text-white">EMI Schedule</h2>

          <div className="mb-4 rounded-lg bg-[#F3F1F7] p-4 dark:bg-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Monthly EMI
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  ₹{monthlyEMI.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Total EMIs
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tenureMonths}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {Array.from({ length: Math.min(3, tenureMonths) }).map((_, index) => {
              const emiDate = new Date();
              emiDate.setMonth(emiDate.getMonth() + index + 1);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-neutral-600"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        EMI {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Due {emiDate.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{monthlyEMI.toLocaleString()}
                  </span>
                </div>
              );
            })}

            {tenureMonths > 3 && (
              <p className="text-center text-sm text-gray-500 dark:text-neutral-500">
                + {tenureMonths - 3} more EMIs
              </p>
            )}
          </div>
        </div>

        {/* Bank Details Form */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-black dark:text-white">Bank Details</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Bank Account Number
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:ring-[#8B7FA8]"
              />
            </div>

            <div>
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Confirm Account Number
              </label>
              <input
                type="text"
                placeholder="Re-enter account number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:ring-[#8B7FA8]"
              />
            </div>

            <div>
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="Enter IFSC code"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:ring-2 focus:ring-[#8B7FA8] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:ring-[#8B7FA8]"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-5 w-5 rounded border-gray-300 text-[#3D3066] focus:ring-[#8B7FA8] dark:border-neutral-600 dark:bg-neutral-700"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 dark:text-neutral-300">
              I agree to the Terms and Conditions and confirm that I have read the Gold Loan Agreement. I understand that my gold ({goldPledged} gm) will be pledged as security and will be returned only upon full repayment of the loan amount along with interest.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full rounded-lg bg-[#3D3066] py-4 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
            Submit Application
          </button>

          <button
            onClick={onBack}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-4 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
          >
            Cancel
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="mb-1 text-sm font-medium text-blue-900 dark:text-blue-300">
                Disbursement Information
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Funds will be disbursed within 24 hours of verification to your registered bank account. You will receive a confirmation message once the amount is credited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}