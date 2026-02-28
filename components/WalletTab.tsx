import { ArrowLeft, Coins, TrendingUp, Download, Share2, Clock, Repeat, Truck, MapPin } from "lucide-react";
import { useState } from "react";
import { ZoldLogo } from "./ZoldLogo";

interface WalletTabProps {
  onBack: () => void;
  onBuyGold: () => void;
  onSellGold: () => void;
}

export function WalletTab({ onBack, onBuyGold, onSellGold }: WalletTabProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"ALL" | "1M" | "1W">("ALL");

  const walletData = {
    totalGold: 12.547,
    currentValue: 77845,
    totalInvested: 68320,
    profitLoss: 9525,
    profitPercentage: 13.94,
    todayProfit: 950,
  };

  const transactions = [
    { id: 1, type: "BUY", amount: 2.5, value: 15500, date: "2024-01-15", status: "Completed" },
    { id: 2, type: "BUY", amount: 1.0, value: 6200, date: "2024-01-10", status: "Completed" },
    { id: 3, type: "SELL", amount: 0.5, value: 3100, date: "2024-01-05", status: "Completed" },
    { id: 4, type: "BUY", amount: 3.0, value: 18600, date: "2023-12-28", status: "Completed" },
    { id: 5, type: "BUY", amount: 2.0, value: 12400, date: "2023-12-15", status: "Completed" },
  ];

  const holdings = [
    { id: 1, purity: "24K", grams: 8.547, value: 53245, purchasePrice: 6100 },
    { id: 2, purity: "22K", grams: 4.0, value: 24600, purchasePrice: 6150 },
  ];

  return (
    <div className="min-h-screen pb-6 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <div className="rounded-b-3xl bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] px-6 pt-6 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm dark:bg-gray-50/10"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <ZoldLogo variant="full" size="sm" theme="light" />
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm dark:bg-gray-50/10">
              <Download className="h-5 w-5 text-white" />
            </button>
            <button className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm dark:bg-gray-50/10">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>



        {/* Wallet Summary */}
        <div className="rounded-2xl bg-gray-50/10 p-6 backdrop-blur-md dark:bg-gray-50/5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Gold Holdings</p>
              <p className="text-2xl font-medium text-white">
                {walletData.totalGold.toFixed(3)}g
              </p>
            </div>
            <Coins className="h-8 w-8 text-white/90" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/80">Current Value</p>
              <p className="text-lg text-white">₹{walletData.currentValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Invested</p>
              <p className="text-lg text-white">₹{walletData.totalInvested.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Profit & Loss</p>
              <div className="flex items-center gap-2">
                <p className="text-lg text-green-300">+₹{walletData.profitLoss.toLocaleString()}</p>
                <span className="text-sm text-green-300">(+{walletData.profitPercentage}%)</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">₹{walletData.todayProfit} today</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={onBuyGold}
            className="rounded-xl bg-[#3D3066] p-4 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]"
          >
            <div className="flex flex-col items-center gap-2">
              <Coins className="h-6 w-6" />
              <span className="text-sm">Buy More</span>
            </div>
          </button>
          <button
            onClick={onSellGold}
            className="rounded-xl bg-gray-50 p-4 text-[#3D3066] transition-colors hover:bg-gray-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          >
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Sell Gold</span>
            </div>
          </button>
        </div>

        {/* Transaction History */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-black dark:text-white">Transaction History</h3>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-700">
              {(["ALL", "1M", "1W"] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`rounded-md px-3 py-1 text-sm ${selectedTimeframe === timeframe
                    ? "bg-gray-50 text-[#3D3066] shadow dark:bg-neutral-600 dark:text-white"
                    : "text-gray-600 dark:text-neutral-400"
                    }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${tx.type === "BUY" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                      {tx.type === "BUY" ? (
                        <Coins className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {tx.type} Gold
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {tx.date} • {tx.amount}g
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === "BUY" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      {tx.type === "BUY" ? "-" : "+"}₹{tx.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {tx.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Holdings Breakdown */}
        <div className="mb-6">
          <h3 className="mb-4 text-black dark:text-white">Gold Holdings Breakdown</h3>
          <div className="space-y-3">
            {holdings.map((holding) => {
              const currentPrice = 6245.5;
              const currentValue = holding.grams * currentPrice;
              const profitLoss = currentValue - (holding.grams * holding.purchasePrice);
              const profitLossPercentage = (profitLoss / (holding.grams * holding.purchasePrice)) * 100;

              return (
                <div
                  key={holding.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {holding.purity} Gold
                      </p>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {holding.grams.toFixed(3)} grams
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{currentValue.toLocaleString()}
                      </p>
                      <p className={`text-sm ${profitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {profitLoss >= 0 ? "+" : ""}₹{profitLoss.toFixed(0)} ({profitLossPercentage.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-neutral-400">
                    <span>Avg. Purchase: ₹{holding.purchasePrice}/g</span>
                    <span>Current: ₹{currentPrice}/g</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Storage Info */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Gold Storage</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                <MapPin className="h-4 w-4" />
                <span>Secure Vault • Mumbai</span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Insurance</p>
              <p className="font-medium text-gray-900 dark:text-white">Covered</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Storage Fee</p>
              <p className="font-medium text-gray-900 dark:text-white">0%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Delivery</p>
              <p className="font-medium text-gray-900 dark:text-white">48h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}