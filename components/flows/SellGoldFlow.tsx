"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Coins,
  MapPin,
  CreditCard,
  CheckCircle,
  Info,
  Sparkles,
  AlertCircle,
  TrendingDown,
  Wallet,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface SellGoldFlowProps {
  onClose: () => void;
}

type Step = "amount" | "storage" | "payment" | "payment-gateway" | "success";

export function SellGoldFlow({ onClose }: SellGoldFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("amount");
  const [inputMode, setInputMode] = useState<"rupees" | "grams">("grams");
  const [amount, setAmount] = useState("");
  const [selectedStorage, setSelectedStorage] = useState<"vault" | "partner">(
    "vault",
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank");
  const [isProceedChecked, setIsProceedChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute price freeze

  // Real-time data from backend
  const [goldSellPrice, setGoldSellPrice] = useState(6180.75);
  const [goldBuyPrice, setGoldBuyPrice] = useState(6245.5);
  const [userGoldBalance, setUserGoldBalance] = useState(0);
  const [testWalletBalance, setTestWalletBalance] = useState(0);
  const [savedBankAccounts, setSavedBankAccounts] = useState<any[]>([]);
  const [savedUpiMethods, setSavedUpiMethods] = useState<any[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedUpiId, setSelectedUpiId] = useState<string | null>(null);

  const priceDifference = goldBuyPrice - goldSellPrice;
  const spreadPercentage = ((priceDifference / goldBuyPrice) * 100).toFixed(2);
  const tdsRate = 3; // 3% GST
  const shippingFee = 150;
  const [gramsValue, setGramsValue] = useState("");
  const [rupeesValue, setRupeesValue] = useState("");
  const enteredGrams = parseFloat(gramsValue || "0");
  const isGoldAmountSufficient = enteredGrams > userGoldBalance;

  const handleInputGramChange = (val: string) => {
    const g = parseFloat(val || "0");

    // stop if insufficient
    if (g > userGoldBalance) {
      setGramsValue(val); // still show typed value
      return;
    }

    setGramsValue(val);
    setRupeesValue((g * goldSellPrice).toFixed(2));
  };



  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Fetch user's wallet data
  const fetchWalletData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Fetch gold rates
      const ratesRes = await fetch(`${API_URL}/gold/rates/current`);
      const ratesData = await ratesRes.json();
      if (ratesData.success) {
        setGoldBuyPrice(parseFloat(ratesData.data.buyRate));
        setGoldSellPrice(parseFloat(ratesData.data.sellRate));
      }

      // Fetch wallet balance
      const balanceRes = await fetch(`${API_URL}/gold/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setUserGoldBalance(parseFloat(balanceData.data.goldBalance) || 0);
      }

      // Fetch test wallet
      const testWalletRes = await fetch(`${API_URL}/gold/test-wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const testWalletData = await testWalletRes.json();
      if (testWalletData.success) {
        setTestWalletBalance(
          parseFloat(testWalletData.data.virtualBalance) || 0,
        );
      }

      // Fetch saved payment methods
      const paymentRes = await fetch(`${API_URL}/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentData = await paymentRes.json();
      console.log("💳 Payment methods response:", paymentData);
      if (paymentData.success && paymentData.data) {
        const bankAccountsList = paymentData.data.bankAccounts || [];
        const paymentMethodsList = paymentData.data.paymentMethods || [];

        console.log("💳 Bank accounts:", bankAccountsList);
        console.log("💳 Payment methods:", paymentMethodsList);
        setSavedBankAccounts(bankAccountsList);
        setSavedUpiMethods(paymentMethodsList);

        // Auto-select primary bank or card
        const primaryBank = bankAccountsList.find((acc: any) => acc.isPrimary);
        const primaryCard = paymentMethodsList.find(
          (m: any) => m.isPrimary && m.type === "CARD",
        );

        if (primaryBank) {
          setSelectedBankId(primaryBank.id);
          setSelectedPaymentMethod("bank");
        } else if (primaryCard) {
          setSelectedUpiId(primaryCard.id);
          setSelectedPaymentMethod("card");
        }
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  // Handle sell gold transaction
  const handleSellGold = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      const response = await fetch(`${API_URL}/gold/sell`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goldGrams: grams,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchWalletData();
        setStep("success");
      } else {
        setError(data.message || "Failed to sell gold");
      }
    } catch (error: any) {
      console.error("Error selling gold:", error);
      setError(error.message || "Failed to sell gold");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();

    // WebSocket for real-time prices
    const socket: Socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5001",
      {
        transports: ["websocket", "polling"],
      },
    );

    socket.on(
      "goldPriceUpdate",
      (data: { buyRate: number; sellRate: number }) => {
        console.log("📊 Sell Gold: Live price update:", data);
        setGoldBuyPrice(data.buyRate);
        setGoldSellPrice(data.sellRate);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  // Price freeze countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const calculateRupees = (grams: number) => {
    return grams * goldSellPrice;
  };

  const calculateGrams = (rupees: number) => {
    return rupees / goldSellPrice;
  };

  const handleGramsChange = (val: string) => {
    setGramsValue(val);
    setInputMode("grams");
    const numVal = parseFloat(val);
    if (val === "" || isNaN(numVal)) {
      setAmount("");
      setRupeesValue("");
      return;
    }
    setAmount(val);
    setRupeesValue((numVal * goldSellPrice).toFixed(2));
  };

  const handleRupeesChange = (val: string) => {
    setRupeesValue(val);
    setInputMode("rupees");
    const numVal = parseFloat(val);
    if (val === "" || isNaN(numVal)) {
      setAmount("");
      setGramsValue("");
      return;
    }
    setAmount(val); // Amount is technically in Rupees now, but logic expects 'amount' to be the primary value. 
    // Wait, if inputMode is 'rupees', 'inputValue' is parsed from 'amount'.
    // Then 'grams' is calculated from 'inputValue'.
    // So setting 'amount' to rupee value is correct if inputMode is 'rupees'.
    setGramsValue((numVal / goldSellPrice).toFixed(4));
  };

  const inputValue = parseFloat(amount) || 0;
  const grams =
    inputMode === "rupees" ? calculateGrams(inputValue) : inputValue;
  const rupees =
    inputMode === "grams" ? calculateRupees(inputValue) : inputValue;

  // Calculate GST (same as buy - 3%)
  const gst = rupees * (tdsRate / 100);
  const shippingCharge = 0;

  const netAmount = rupees - gst;

  const storageOptions = [
    {
      id: "vault",
      name: "Zold Vault",
      description: "Instant settlement to your bank account",
      processingTime: "2-4 hours",
      icon: Shield,
    },
  ];

  const paymentMethods = [
    {
      id: "bank",
      name: "Bank Transfer",
      icon: CreditCard,
      description: "Direct to your bank account",
    },
    {
      id: "credit",
      name: "Store Credit",
      icon: Wallet,
      description: "Use for future purchases",
    },
  ];

  // Check if user has enough gold
  const hasInsufficientGold = grams > userGoldBalance;
  const isValidAmount =
    parseFloat(amount) > 0 && grams <= userGoldBalance && grams >= 0.1;

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      {/* Header - Responsive (Matching BuyGold) */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#FCDE5B] via-[#f5d347] to-[#edc830] px-4 py-3 shadow-lg sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition-colors hover:bg-black/10 sm:p-2"
            >
              <X className="h-5 w-5 text-[#1a1a2e] sm:h-6 sm:w-6" />
            </button>
            <h2 className="text-lg font-bold text-[#1a1a2e] sm:text-xl">
              Sell Gold
            </h2>
          </div>
          <div className="rounded-full bg-[#1a1a2e]/10 px-2.5 py-1 sm:px-3">
            <span className="text-xs font-medium text-[#1a1a2e] sm:text-sm">
              Step{" "}
              {step === "amount"
                ? 1
                : step === "storage"
                  ? 2
                  : step === "payment"
                    ? 3
                    : 4}{" "}
              of 4
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8">
        {step === "amount" && (
          <div>
            {/* Live Rate Card with Timer */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      Live Sell Rate (24K)
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{goldSellPrice.toFixed(2)}
                    <span className="text-base font-normal text-gray-500">
                      /gram
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      -{spreadPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Valid for {formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-neutral-400">
                    Buy Price
                  </span>
                  <span className="font-medium text-gray-700 dark:text-neutral-300">
                    ₹{goldBuyPrice.toFixed(2)}/gram
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Spread: ₹{priceDifference.toFixed(2)} ({spreadPercentage}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Your Gold Balance - Premium Card */}
            <div className="mb-4 rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 shadow-xl sm:mb-6 sm:rounded-2xl sm:p-5">
              <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <div>
                  <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                    <Coins className="h-4 w-4 text-[#FCDE5B] sm:h-5 sm:w-5" />
                    <span className="text-xs font-medium text-[#FCDE5B] sm:text-sm">
                      Available to Sell
                    </span>
                  </div>
                  <p className="text-2xl font-bold sm:text-3xl">
                    {userGoldBalance.toFixed(4)}g
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/70 sm:mt-1 sm:text-xs">
                    ≈ ₹{(userGoldBalance * goldSellPrice).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[#FCDE5B]/20 px-3 py-2 sm:px-4">
                  <Shield className="h-4 w-4 text-[#FCDE5B]" />
                  <span className="text-xs font-medium text-[#FCDE5B] sm:text-sm">
                    Zold Vault
                  </span>
                </div>
              </div>
            </div>

            {/* Input Mode Toggle - Responsive */}
            <div className="mb-4 grid grid-cols-2 gap-1.5 sm:mb-6 sm:gap-2">
              <button
                onClick={() => {
                  setInputMode("grams");
                  setAmount("");
                  setGramsValue("");
                  setRupeesValue("");
                }}
                className={`rounded-lg py-2.5 text-xs font-semibold transition-all sm:rounded-xl sm:py-3 sm:text-sm ${inputMode === "grams"
                  ? "bg-[#FCDE5B] text-[#1a1a2e] shadow-md"
                  : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FCDE5B] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
              >
                Sell in Grams
              </button>
              <button
                onClick={() => {
                  setInputMode("rupees");
                  setAmount("");
                  setGramsValue("");
                  setRupeesValue("");
                }}
                className={`rounded-lg py-2.5 text-xs font-semibold transition-all sm:rounded-xl sm:py-3 sm:text-sm ${inputMode === "rupees"
                  ? "bg-[#FCDE5B] text-[#1a1a2e] shadow-md"
                  : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FCDE5B] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}
              >
                Sell in ₹
              </button>
            </div>

            {/* Amount Input - Responsive */}
            {/* Amount Inputs */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-lg sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">

              <div className="flex items-center gap-3">

                {/* Grams */}
                <div className="relative flex-1">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    gm
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={gramsValue}
                    onChange={(e) => handleGramsChange(e.target.value)}
                    placeholder="1.0"
                    className="w-full rounded-xl border px-4 py-3 pr-12 font-semibold text-black"
                  />
                </div>

                {/* Swap */}
                <button // onClick={swapInputs} 
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCDE5B] text-lg font-bold shadow" > ⇆
                </button>

                {/* Rupees */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={rupeesValue}
                    onChange={(e) => handleRupeesChange(e.target.value)}
                    placeholder="1000"
                    className="w-full rounded-xl border px-8 py-3 font-semibold text-black"
                  />
                </div>


              </div>
              {isGoldAmountSufficient && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Insufficient amount of gold. Available: {userGoldBalance.toFixed(2)} g
                </div>

              )}
            </div>


            {/* Quick Amount Buttons - Responsive */}
            {inputMode === "grams" && (
              <div className="mb-4 grid grid-cols-4 gap-2 sm:mb-6 sm:gap-3">
                {[0.5, 1.0, 2.0, 5.0].map((gms) => (
                  <button
                    key={gms}
                    onClick={() => handleGramsChange(gms.toString())}
                    className="rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:border-[#FCDE5B] hover:bg-[#FCDE5B]/5 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:py-3 sm:text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  // disabled={gms > userGoldBalance}
                  >
                    {gms}g
                  </button>
                ))}
              </div>
            )}

            {/* Price Breakdown - Responsive */}
            {amount && isValidAmount && (
              <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-lg sm:mb-6 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base dark:text-white">
                  Estimated Proceeds
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Gold Value ({grams.toFixed(4)}g)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{rupees.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-neutral-400">
                      GST ({tdsRate}%)
                    </span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      - ₹{gst.toFixed(2)}
                    </span>
                  </div>

                  {selectedStorage === "partner" && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Shipping/Verification
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        - ₹{shippingCharge.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-100 pt-2 sm:pt-3 dark:border-neutral-700">
                    <span className="text-sm font-bold text-gray-900 sm:text-base dark:text-white">
                      Net Amount
                    </span>
                    <span className="text-sm font-bold text-green-600 sm:text-base dark:text-green-400">
                      ₹{netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Important Information - Responsive */}
            <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3 sm:mb-6 sm:rounded-2xl sm:p-4 dark:border-orange-800 dark:bg-orange-900/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 text-orange-600 sm:h-5 sm:w-5 dark:text-orange-400" />
                <div className="text-xs sm:text-sm">
                  <p className="mb-1 font-semibold text-orange-900 dark:text-orange-300">
                    Important Notes
                  </p>
                  <ul className="space-y-0.5 text-orange-800 sm:space-y-1 dark:text-orange-400">
                    <li>
                      • GST @{tdsRate}% will be deducted from the proceeds
                    </li>
                    <li>• Final amount subject to purity verification</li>
                    <li>• Processing time varies by settlement method</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Continue Button - Premium Golden Style */}
            <button
              onClick={() => setStep("storage")}
              disabled={!isValidAmount}
              className="w-full rounded-xl bg-[#FCDE5B] py-3.5 text-base font-bold text-[#1a1a2e] shadow-lg shadow-[#FCDE5B]/30 transition-all hover:bg-[#f5d347] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none sm:rounded-2xl sm:py-4 sm:text-lg"
            >
              Continue to Settlement
            </button>
          </div>
        )}

        {step === "storage" && (
          <div>
            <h2 className="mb-4 text-black dark:text-white">
              Choose Settlement Method
            </h2>

            {/* Storage Options */}
            <div className="mb-6 space-y-3">
              {storageOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      setSelectedStorage(option.id as "vault" | "partner")
                    }
                    className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${selectedStorage === option.id
                      ? "border-[#3D3066] bg-[#F3F1F7] dark:border-[#8B7FA8] dark:bg-neutral-700"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                      }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedStorage === option.id
                          ? "border-[#3D3066] dark:border-[#8B7FA8]"
                          : "border-gray-300 dark:border-neutral-600"
                          }`}
                      >
                        {selectedStorage === option.id && (
                          <div className="h-3 w-3 rounded-full bg-[#3D3066] dark:bg-[#8B7FA8]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 dark:text-white">
                            {option.name}
                          </p>
                          <span className="text-sm text-gray-500 dark:text-neutral-400">
                            {option.processingTime}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          {option.description}
                        </p>
                      </div>
                      <Icon className="h-5 w-5 text-gray-600 dark:text-neutral-500" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Option Details */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
              <h4 className="mb-2 text-gray-900 dark:text-white">
                {selectedStorage === "vault"
                  ? "Digital Vault Settlement"
                  : "Partner Store Collection"}
              </h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {selectedStorage === "vault"
                  ? "Your gold will be verified digitally and amount will be settled to your chosen payment method."
                  : "You will receive an appointment to visit the selected partner store for physical verification and collection."}
              </p>
            </div>

            {/* Proceed Confirmation */}
            {selectedStorage === "vault" && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="proceedConfirm"
                    checked={isProceedChecked}
                    onChange={(e) => setIsProceedChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <label
                      htmlFor="proceedConfirm"
                      className="text-gray-900 dark:text-white"
                    >
                      I understand that by proceeding, I am selling{" "}
                      {grams.toFixed(4)} grams of gold
                    </label>
                    <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                      This action is irreversible. Your gold will be deducted
                      from your vault balance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 py-4 text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep("payment")}
                disabled={selectedStorage === "vault" && !isProceedChecked}
                className="flex-1 rounded-lg bg-[#3D3066] py-4 text-white transition-colors hover:bg-[#5C4E7F] disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F] dark:disabled:bg-neutral-700"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div>
            {/* Order Summary - Premium Card */}
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-5 shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-[#FCDE5B]" />
                <h3 className="font-bold text-white">Sell Order Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gold Selling</span>
                  <span className="font-medium text-white">
                    {grams.toFixed(4)} grams
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sell Rate</span>
                  <span className="font-medium text-white">
                    ₹{goldSellPrice.toFixed(2)}/gm
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gold Value</span>
                  <span className="font-medium text-white">
                    ₹{rupees.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    GST Deduction ({tdsRate}%)
                  </span>
                  <span className="font-medium text-red-400">
                    - ₹{gst.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-3">
                  <span className="font-bold text-[#FCDE5B]">Net Amount</span>
                  <span className="text-lg font-bold text-[#FCDE5B]">
                    ₹{netAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods - Production Level UI */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Receive Payment Via
                </h3>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Instant Settlement
                </span>
              </div>

              {savedBankAccounts.length > 0 || savedUpiMethods.length > 0 ? (
                <div className="space-y-3">
                  {/* Section Header - Bank Accounts */}
                  {savedBankAccounts.length > 0 && (
                    <div className="mb-2">
                      <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                        Bank Accounts
                      </p>
                      {savedBankAccounts.map((account) => (
                        <button
                          key={account.id}
                          onClick={() => {
                            setSelectedBankId(account.id);
                            setSelectedUpiId(null);
                            setSelectedPaymentMethod("bank");
                          }}
                          className={`mb-2 w-full rounded-xl border-2 p-4 text-left transition-all ${selectedBankId === account.id
                            ? "border-[#FCDE5B] bg-[#FCDE5B]/10 shadow-md dark:bg-[#FCDE5B]/5"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedBankId === account.id
                                ? "bg-[#FCDE5B] text-[#1a1a2e]"
                                : "bg-gray-200 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                                }`}
                            >
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {account.bankName}
                                </span>
                                {account.isPrimary && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                                {account.accountHolderName} • ••••
                                {account.accountNumber.slice(-4)}
                              </p>
                            </div>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${selectedBankId === account.id
                                ? "border-[#FCDE5B] bg-[#FCDE5B]"
                                : "border-gray-300 dark:border-neutral-600"
                                }`}
                            >
                              {selectedBankId === account.id && (
                                <CheckCircle className="h-4 w-4 text-[#1a1a2e]" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Section Header - Saved Cards & Wallets */}
                  {savedUpiMethods.filter(
                    (m) =>
                      m.type === "CARD" ||
                      m.type === "WALLET" ||
                      m.type === "NETBANKING",
                  ).length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                          Other Payment Methods
                        </p>
                        {savedUpiMethods
                          .filter(
                            (m) =>
                              m.type === "CARD" ||
                              m.type === "WALLET" ||
                              m.type === "NETBANKING",
                          )
                          .map((method) => (
                            <button
                              key={method.id}
                              onClick={() => {
                                setSelectedUpiId(method.id);
                                setSelectedBankId(null);
                                setSelectedPaymentMethod(
                                  method.type.toLowerCase(),
                                );
                              }}
                              className={`mb-2 w-full rounded-xl border-2 p-4 text-left transition-all ${selectedUpiId === method.id
                                ? "border-[#FCDE5B] bg-[#FCDE5B]/10 shadow-md dark:bg-[#FCDE5B]/5"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedUpiId === method.id
                                    ? "bg-[#FCDE5B] text-[#1a1a2e]"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                    }`}
                                >
                                  {method.type === "CARD" ? (
                                    <CreditCard className="h-5 w-5" />
                                  ) : (
                                    <Wallet className="h-5 w-5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {method.type === "CARD"
                                        ? `${method.cardNetwork || "Card"} •••• ${method.cardLast4 || "****"}`
                                        : method.provider || method.type}
                                    </span>
                                    {method.isPrimary && (
                                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                                    {method.type === "CARD"
                                      ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                                      : "Instant refund"}
                                  </p>
                                </div>
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${selectedUpiId === method.id
                                    ? "border-[#FCDE5B] bg-[#FCDE5B]"
                                    : "border-gray-300 dark:border-neutral-600"
                                    }`}
                                >
                                  {selectedUpiId === method.id && (
                                    <CheckCircle className="h-4 w-4 text-[#1a1a2e]" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}

                  {/* Store Credit Option */}
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-neutral-400">
                      Wallet Credit
                    </p>
                    <button
                      onClick={() => {
                        setSelectedBankId(null);
                        setSelectedUpiId(null);
                        setSelectedPaymentMethod("credit");
                      }}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedPaymentMethod === "credit" &&
                        !selectedBankId &&
                        !selectedUpiId
                        ? "border-[#FCDE5B] bg-[#FCDE5B]/10 shadow-md dark:bg-[#FCDE5B]/5"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedPaymentMethod === "credit" &&
                            !selectedBankId &&
                            !selectedUpiId
                            ? "bg-[#FCDE5B] text-[#1a1a2e]"
                            : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}
                        >
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Zold Wallet Credit
                          </span>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                            Instant credit • Use for future purchases
                          </p>
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${selectedPaymentMethod === "credit" &&
                            !selectedBankId &&
                            !selectedUpiId
                            ? "border-[#FCDE5B] bg-[#FCDE5B]"
                            : "border-gray-300 dark:border-neutral-600"
                            }`}
                        >
                          {selectedPaymentMethod === "credit" &&
                            !selectedBankId &&
                            !selectedUpiId && (
                              <CheckCircle className="h-4 w-4 text-[#1a1a2e]" />
                            )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:border-neutral-700 dark:from-neutral-800/50 dark:to-neutral-800">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FCDE5B]/20">
                    <CreditCard className="h-8 w-8 text-[#FCDE5B]" />
                  </div>
                  <p className="mb-2 text-center text-lg font-bold text-gray-700 dark:text-neutral-300">
                    No Payment Methods Found
                  </p>
                  <p className="mb-5 max-w-xs text-center text-sm text-gray-500 dark:text-neutral-500">
                    Add a bank account to receive your gold sale proceeds
                    instantly
                  </p>
                  <button
                    onClick={() => router.push("/profile?tab=payment")}
                    className="rounded-xl bg-[#FCDE5B] px-6 py-3 text-sm font-bold text-[#1a1a2e] shadow-lg shadow-[#FCDE5B]/30 transition-all hover:bg-[#f5d347] hover:shadow-xl"
                  >
                    + Add Payment Method
                  </button>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900 dark:text-green-300">
                    Secure & Instant Settlement
                  </p>
                  <p className="mt-1 text-green-800 dark:text-green-400">
                    {selectedStorage === "vault"
                      ? "Amount will be credited within 2-4 hours after verification"
                      : "Visit partner store within 7 days for physical verification"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("storage")}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep("payment-gateway")}
                disabled={
                  !selectedBankId &&
                  !selectedUpiId &&
                  selectedPaymentMethod !== "credit"
                }
                className="flex-1 rounded-xl bg-[#FCDE5B] py-4 font-bold text-[#1a1a2e] shadow-lg shadow-[#FCDE5B]/30 transition-all hover:bg-[#f5d347] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                Confirm Sell Order
              </button>
            </div>
          </div>
        )}

        {step === "payment-gateway" &&
          (() => {
            // Get selected payment details
            const selectedBank = savedBankAccounts.find(
              (a: any) => a.id === selectedBankId,
            );
            const selectedCard = savedUpiMethods.find(
              (m: any) => m.id === selectedUpiId,
            );

            return (
              <div>
                {/* Page Title */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Confirm Your Sell Order
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                    Review your order details before confirming
                  </p>
                </div>

                {/* Order Summary Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-[#FCDE5B]" />
                        <span className="font-bold text-white">
                          Order Summary
                        </span>
                      </div>
                      <span className="rounded-full bg-[#FCDE5B]/20 px-3 py-1 text-xs font-semibold text-[#FCDE5B]">
                        SELL ORDER
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3 p-5">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Gold Quantity
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {grams.toFixed(4)} grams
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Sell Rate (24K)
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{goldSellPrice.toFixed(2)}/gram
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Gross Amount
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{rupees.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600 dark:text-red-400">
                      <span>GST ({tdsRate}%)</span>
                      <span className="font-semibold">- ₹{gst.toFixed(2)}</span>
                    </div>

                    <div className="my-3 border-t border-dashed border-gray-200 dark:border-neutral-700" />

                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Net Amount
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₹{netAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                      <span className="font-bold text-gray-900 dark:text-white">
                        Payment Method
                      </span>
                    </div>
                    <button
                      onClick={() => setStep("payment")}
                      className="text-sm font-medium text-[#3D3066] hover:underline dark:text-[#8B7FA8]"
                    >
                      Change
                    </button>
                  </div>

                  {/* Selected Payment Details */}
                  <div className="p-5">
                    {/* Bank Account */}
                    {selectedBank && (
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                          <CreditCard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedBank.bankName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            {selectedBank.accountHolderName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-neutral-500">
                            A/C: ••••••{selectedBank.accountNumber.slice(-4)} •
                            IFSC: {selectedBank.ifscCode}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    )}

                    {/* Saved Card/Wallet */}
                    {selectedCard && (
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl ${selectedCard.type === "CARD"
                            ? "bg-purple-100 dark:bg-purple-900/30"
                            : "bg-orange-100 dark:bg-orange-900/30"
                            }`}
                        >
                          {selectedCard.type === "CARD" ? (
                            <CreditCard className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Wallet className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedCard.type === "CARD"
                              ? `${selectedCard.cardNetwork || "Card"} •••• ${selectedCard.cardLast4 || "****"}`
                              : selectedCard.provider || "Wallet"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            {selectedCard.type === "CARD"
                              ? `Expires ${selectedCard.expiryMonth}/${selectedCard.expiryYear}`
                              : "Refund instantly"}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    )}

                    {/* Store Credit */}
                    {selectedPaymentMethod === "credit" &&
                      !selectedBank &&
                      !selectedCard && (
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#FCDE5B]/30 to-[#f5d347]/20">
                            <Wallet className="h-7 w-7 text-[#1a1a2e]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Zold Wallet Credit
                            </p>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                              Amount will be added to your wallet instantly
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Instant
                              </span>
                              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                No fees
                              </span>
                            </div>
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Settlement Timeline */}
                <div className="mb-6 rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-neutral-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Settlement Timeline
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        {selectedPaymentMethod === "credit"
                          ? "Instant credit to your Zold Wallet"
                          : selectedBank
                            ? `Within 2-4 hours to ${selectedBank.bankName}`
                            : "Within 2-4 hours to your selected method"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Footer */}
                <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 dark:bg-green-900/20">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Secure & Encrypted Transaction
                  </span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 rounded-xl border border-gray-300 bg-gray-50 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSellGold}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-[#FCDE5B] py-4 font-bold text-[#1a1a2e] shadow-lg shadow-[#FCDE5B]/30 transition-all hover:bg-[#f5d347] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Sell Gold for ₹${netAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            );
          })()}

        {step === "success" && (
          <div className="text-center">
            <div className="mb-6 rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50">
              {/* Pending Icon - Clock instead of CheckCircle */}
              <div className="relative mx-auto mb-6 h-24 w-24 rounded-full bg-amber-100 p-6 dark:bg-amber-900/30">
                <Clock className="absolute inset-0 m-auto h-12 w-12 text-amber-600 dark:text-amber-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles
                    className="h-6 w-6 animate-pulse text-amber-400"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </div>

              <h1 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                Sell Request Submitted!
              </h1>
              <p className="mb-6 text-gray-600 dark:text-neutral-400">
                Your request to sell {grams.toFixed(4)} grams of gold has been
                submitted successfully.
              </p>

              {/* Processing Notice */}
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-amber-900 dark:text-amber-300">
                      Processing Time: 14-15 Business Days
                    </p>
                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-400/80">
                      Your sell request is under review. Once approved by our
                      team, the amount will be credited to your selected payment
                      method.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Order Details */}
                <div className="rounded-lg bg-[#F3F1F7] p-4 dark:bg-neutral-700">
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                      Request Status
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      PENDING REVIEW
                    </span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                      Gold Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {grams.toFixed(4)} grams
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                      Amount (after approval)
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ₹{netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
                  <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                    Your updated gold balance
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(userGoldBalance - grams).toFixed(4)} grams
                  </p>
                </div>

                {/* Info Note */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-300">
                      You will be notified once your request is approved
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  router.push("/wallet");
                }}
                className="w-full rounded-xl bg-[#3D3066] py-4 font-semibold text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]"
              >
                View Wallet
              </button>
              <button
                onClick={() => {
                  onClose();
                  router.push("/profile?tab=transactions");
                }}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Track Request Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
