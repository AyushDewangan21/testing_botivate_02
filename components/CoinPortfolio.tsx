"use client";

import { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Award,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface CoinItem {
  id: string | null;
  coinGrams: number;
  quantity: number;
  totalGrams: number;
  currentValue: string;
  coinName: string;
}

interface CoinTransaction {
  id: string;
  type: string;
  coinGrams: number;
  quantity: number;
  goldValue: string;
  gst: string;
  finalAmount: string;
  paymentMode: string;
  createdAt: string;
}

interface CoinInventoryData {
  inventory: CoinItem[];
  totalGrams: number;
  totalValue: string;
  currentRatePerGram: string;
}

export function CoinPortfolio() {
  const [inventory, setInventory] = useState<CoinInventoryData | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchCoinInventory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/coins/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error("Error fetching coin inventory:", error);
    }
  };

  const fetchCoinTransactions = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/coins/transactions?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error fetching coin transactions:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCoinInventory(), fetchCoinTransactions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCoinGradient = (grams: number) => {
    switch (grams) {
      case 1:
        return "from-amber-400 via-yellow-300 to-amber-500";
      case 2:
        return "from-yellow-400 via-amber-300 to-yellow-500";
      case 5:
        return "from-orange-400 via-yellow-400 to-orange-500";
      case 10:
        return "from-amber-500 via-yellow-400 to-amber-600";
      default:
        return "from-yellow-400 to-amber-500";
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-neutral-700"></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-gray-200 dark:bg-neutral-700"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const hasCoins = inventory && inventory.totalGrams > 0;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 shadow-lg dark:border-neutral-700 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-900">
        {/* Decorative Elements */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#FCDE5B]/30 to-transparent blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-amber-300/20 to-transparent blur-xl"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#FCDE5B]" />
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                My Gold Coins
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              24K Pure Gold Coins in Vault
            </p>
          </div>
          <button
            onClick={() => {
              fetchCoinInventory();
              fetchCoinTransactions();
            }}
            className="rounded-full bg-gray-50/80 p-2 transition-all hover:bg-gray-50 dark:bg-neutral-700/80 dark:hover:bg-neutral-700"
          >
            <RefreshCw className="h-4 w-4 text-gray-600 dark:text-neutral-300" />
          </button>
        </div>

        {/* Total Value */}
        {hasCoins && (
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Total Value
              </p>
              <p className="text-3xl font-bold text-gray-600 dark:text-white">
                ₹{parseFloat(inventory.totalValue).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Total Gold
              </p>
              <p className="text-xl font-bold text-[#FCDE5B]">
                {inventory.totalGrams}g
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coin Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {inventory?.inventory.map((coin) => (
          <div
            key={coin.coinGrams}
            className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all ${coin.quantity > 0
              ? "border-[#FCDE5B]/50 bg-gray-50 shadow-lg dark:bg-neutral-800"
              : "border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900"
              }`}
          >
            {/* Coin Visual */}
            <div className="mb-3 flex justify-center">
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ${getCoinGradient(coin.coinGrams)} ${coin.quantity === 0 ? "opacity-40" : ""}`}
              >
                <Coins className="h-8 w-8 text-amber-800/70" />
                {coin.quantity > 0 && (
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 animate-pulse text-white" />
                )}
                <span className="absolute bottom-0 text-[10px] font-bold text-amber-900/80">
                  {coin.coinGrams}g
                </span>
              </div>
            </div>

            {/* Coin Info */}
            <div className="text-center">
              <p
                className={`text-sm font-semibold ${coin.quantity > 0 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-neutral-500"}`}
              >
                {coin.coinName}
              </p>
              <p
                className={`text-2xl font-bold ${coin.quantity > 0 ? "text-[#1a1a2e] dark:text-[#FCDE5B]" : "text-gray-300 dark:text-neutral-600"}`}
              >
                {coin.quantity}
              </p>
              {coin.quantity > 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  ₹{parseFloat(coin.currentValue).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!hasCoins && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-600">
            <Coins className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-neutral-300">
            No Coins Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            Buy gold coins to start your collection. Choose from 1g, 2g, 5g, or
            10g coins.
          </p>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Coin Transactions
              </h3>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-gray-400 transition-transform ${showTransactions ? "rotate-90" : ""}`}
            />
          </button>

          {showTransactions && (
            <div className="mt-4 space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${tx.type === "BUY_WITH_RUPEES"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                    >
                      {tx.type === "BUY_WITH_RUPEES" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tx.type === "BUY_WITH_RUPEES"
                          ? "Purchased"
                          : "Converted"}{" "}
                        {tx.quantity}x {tx.coinGrams}g Coin
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {tx.type === "BUY_WITH_RUPEES"
                        ? `₹${parseFloat(tx.finalAmount).toLocaleString("en-IN")}`
                        : `${tx.coinGrams * tx.quantity}g`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      {tx.paymentMode === "TEST_WALLET"
                        ? "Test Wallet"
                        : "Wallet Gold"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
