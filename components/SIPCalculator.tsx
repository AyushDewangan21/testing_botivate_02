import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Calendar, Coins, ArrowRight, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SIPCalculatorProps {
  onClose: () => void;
}

export function SIPCalculator({ onClose }: SIPCalculatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [duration, setDuration] = useState(12); // months
  const [expectedReturn, setExpectedReturn] = useState(12); // annual %
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate returns
  const totalInvestment = monthlyInvestment * duration;
  const monthlyRate = expectedReturn / 12 / 100;
  const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, duration) - 1) / monthlyRate) * (1 + monthlyRate));
  const estimatedReturns = futureValue - totalInvestment;
  const totalValue = totalInvestment + estimatedReturns;

  // Pie chart data
  const chartData = [
    { name: 'Investment', value: totalInvestment, color: '#8B7FA8' },
    { name: 'Returns', value: estimatedReturns, color: '#D4AF37' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 dark:bg-black/70">
      <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
      <div className="zold-hide-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-gray-50 dark:bg-neutral-800">
        {/* Header */}
        <div className="sticky top-0 rounded-t-3xl bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] px-6 py-5 dark:from-[#4D3F7F] dark:to-[#5C4E9F]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">SIP Calculator</h2>
                <p className="text-sm text-white/80">
                  Plan your gold investment
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
          {/* Input Controls */}
          <div className="mb-6 space-y-6">
            {/* Monthly Investment */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-gray-700 dark:text-neutral-300">
                  Monthly Investment
                </label>
                <span className="text-[#3D3066] dark:text-[#8B7FA8]">
                  ₹{monthlyInvestment.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#3D3066] dark:bg-neutral-700 dark:accent-[#8B7FA8]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-neutral-400">
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-gray-700 dark:text-neutral-300">
                  Duration
                </label>
                <span className="text-[#3D3066] dark:text-[#8B7FA8]">
                  {duration} {duration === 1 ? "month" : "months"}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="120"
                step="3"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#3D3066] dark:bg-neutral-700 dark:accent-[#8B7FA8]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-neutral-400">
                <span>3 months</span>
                <span>10 years</span>
              </div>
            </div>

            {/* Expected Return */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-gray-700 dark:text-neutral-300">
                  Expected Annual Return
                </label>
                <span className="text-[#3D3066] dark:text-[#8B7FA8]">
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#3D3066] dark:bg-neutral-700 dark:accent-[#8B7FA8]"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-neutral-400">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#3D3066] to-[#5C4E7F] p-6 dark:from-[#4D3F7F] dark:to-[#5C4E9F]">
            <p className="mb-4 text-sm text-white/90">Estimated Returns</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Total Investment</span>
                <span className="text-white">
                  ₹{totalInvestment.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Est. Returns</span>
                <span className="text-green-300">
                  +₹{Math.round(estimatedReturns).toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-gray-50/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-white">Total Value</span>
                <span className="text-white">
                  ₹{Math.round(totalValue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6 rounded-2xl bg-gray-50 p-6 dark:bg-neutral-700">
            <h3 className="mb-4 text-gray-900 dark:text-white">
              Investment Breakdown
            </h3>
            <div className="h-48" style={{ minHeight: '192px' }}>
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        typeof value === "number"
                          ? `₹${value.toLocaleString()}`
                          : ""
                      }
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e7eb",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Calculator className="h-8 w-8 animate-pulse" />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#8B7FA8]"></div>
                <span className="text-sm text-gray-600 dark:text-neutral-300">
                  Investment
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#D4AF37]"></div>
                <span className="text-sm text-gray-600 dark:text-neutral-300">
                  Returns
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Options */}
          <div className="mb-6">
            <h3 className="mb-3 text-gray-900 dark:text-white">
              Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setMonthlyInvestment(2000);
                  setDuration(12);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-[#3D3066] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]"
              >
                <p className="text-sm text-gray-900 dark:text-white">
                  Starter Plan
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  ₹2,000/mo • 1 year
                </p>
              </button>
              <button
                onClick={() => {
                  setMonthlyInvestment(5000);
                  setDuration(24);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-[#3D3066] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]"
              >
                <p className="text-sm text-gray-900 dark:text-white">
                  Growth Plan
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  ₹5,000/mo • 2 years
                </p>
              </button>
              <button
                onClick={() => {
                  setMonthlyInvestment(10000);
                  setDuration(36);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-[#3D3066] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]"
              >
                <p className="text-sm text-gray-900 dark:text-white">
                  Premium Plan
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  ₹10,000/mo • 3 years
                </p>
              </button>
              <button
                onClick={() => {
                  setMonthlyInvestment(20000);
                  setDuration(60);
                }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-[#3D3066] dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8]"
              >
                <p className="text-sm text-gray-900 dark:text-white">
                  Elite Plan
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  ₹20,000/mo • 5 years
                </p>
              </button>
            </div>
          </div>

          {/* CTA */}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D3066] py-4 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]">
            <span>Start SIP Investment</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="mt-4 text-center text-xs text-gray-500 dark:text-neutral-400">
            *Returns are estimated based on historical gold price appreciation.
            Actual returns may vary.
          </p>
        </div>
      </div>
    </div>
  );
}