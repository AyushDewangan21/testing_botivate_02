import { useState, useEffect, useCallback } from "react";
import {
  Gift,
  User,
  Coins,
  Heart,
  Calendar,
  Send,
  X,
  ArrowRight,
  Minus,
  Plus,
  Wallet,
  Scale,
  CheckCircle,
  Loader2,
  UserCheck,
  UserPlus,
  Phone,
  ArrowLeftRight,
  Sparkles,
  Gem,
  CircleDot,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "../lib/auth";
import { useSelector } from "react-redux";
import router from "next/router";

interface GiftGoldProps {
  onClose: () => void;
}

interface CoinInventory {
  coinGrams: number;
  quantity: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function GiftGold({ onClose }: GiftGoldProps) {
  const [step, setStep] = useState<
    "metal" | "form" | "amount" | "recipient" | "message" | "confirm"
  >("metal");

  // Metal type selection (gold or silver)
  const [metalType, setMetalType] = useState<"gold" | "silver">("gold");

  // 
  const [inputMode, setInputMode] = useState<"weight" | "amount">("weight");


  // Form type selection (raw or bar)
  const [formType, setFormType] = useState<"raw" | "bar">("raw");

  // Gift type state - for backward compatibility with existing logic
  const [giftType, setGiftType] = useState<"grams" | "coins">("grams");

  // Grams mode
  const [gramsAmount, setGramsAmount] = useState(0.5);
  const [weightInput, setWeightInput] = useState("0.5");
  const [valueInput, setValueInput] = useState("");

  // Present amount
  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  // store selected preset value
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Coins mode
  const [selectedCoin, setSelectedCoin] = useState<1 | 2 | 5 | 10>(1);
  const [coinQuantity, setCoinQuantity] = useState(1);
  const [coinInventory, setCoinInventory] = useState<CoinInventory[]>([]);

  // Common fields
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [occasion, setOccasion] = useState("birthday");
  const [isLoading, setIsLoading] = useState(false);

  // User lookup state
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    name?: string;
    email?: string;
    id?: string;
    message?: string;
  } | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Gold price
  const [goldPrice, setGoldPrice] = useState(6245.5);
  // Silver price (you'll need to fetch this from API)
  const [silverPrice, setSilverPrice] = useState(75.5); // Default value

  // set amount from preset
  const setFromAmount = (amount: number) => {
    const currentPrice = metalType === "gold" ? goldPrice : silverPrice;

    const grams = amount / currentPrice;

    setInputMode("amount");        // 🔥 amount is source of truth
    setSelectedAmount(amount);
    setValueInput(amount.toFixed(2));   // keep exact
    setGramsAmount(Number(grams.toFixed(4)));
    setWeightInput(grams.toFixed(4));
  };

  const [currentUserName, setCurrentUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUserName(user?.username || user?.name || "User");
    }
  }, []);

  // Fetch coin inventory and prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch gold price
        const goldRateRes = await fetch(`${API_URL}/gold/rates/current`);
        const goldRateData = await goldRateRes.json();
        if (goldRateData.success) {
          setGoldPrice(parseFloat(goldRateData.data.buyRate));
        }

        // Fetch silver price (adjust endpoint as needed)
        const silverRateRes = await fetch(`${API_URL}/silver/rates/current`);
        const silverRateData = await silverRateRes.json();
        if (silverRateData.success) {
          setSilverPrice(parseFloat(silverRateData.data.buyRate));
        }

        // Fetch coin inventory
        const coinRes = await fetch(`${API_URL}/coins/inventory`, {
          headers: getAuthHeaders() as HeadersInit,
        });
        const coinData = await coinRes.json();
        if (coinData.success && coinData.data) {
          setCoinInventory(coinData.data.inventory || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Update value when weight changes
  useEffect(() => {
    if (giftType !== "grams") return;

    const currentPrice = metalType === "gold" ? goldPrice : silverPrice;

    if (inputMode === "weight") {
      const value = gramsAmount * currentPrice;
      setValueInput(value.toFixed(2));
    }

    if (inputMode === "amount") {
      const grams = parseFloat(valueInput) / currentPrice;
      if (!isNaN(grams)) {
        setGramsAmount(Number(grams.toFixed(4)));
        setWeightInput(grams.toFixed(4));
      }
    }
  }, [gramsAmount, valueInput, goldPrice, silverPrice, metalType, giftType, inputMode]);

  // Calculate display values based on gift type
  const getDisplayValues = () => {
    const currentPrice = metalType === "gold" ? goldPrice : silverPrice;

    if (giftType === "grams") {
      const amount = gramsAmount * currentPrice;
      return { amount: amount.toFixed(2), grams: gramsAmount.toFixed(2) };
    } else {
      const totalGrams = selectedCoin * coinQuantity;
      const amount = totalGrams * currentPrice;
      return {
        amount: amount.toFixed(2),
        grams: totalGrams.toFixed(2),
        coins: `${coinQuantity}x ${selectedCoin}g`,
      };
    }
  };

  const displayValues = getDisplayValues();

  // Handle weight input change
  const handleWeightChange = (weight: string) => {
    setInputMode("weight");
    setWeightInput(weight);
    const parsedWeight = parseFloat(weight);
    if (!isNaN(parsedWeight) && parsedWeight > 0) {
      setGramsAmount(parsedWeight);
    }
  };

  // Handle value input change
  const handleValueChange = (value: string) => {
    setInputMode("amount");
    setValueInput(value);
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const currentPrice = metalType === "gold" ? goldPrice : silverPrice;
      const calculatedWeight = parsedValue / currentPrice;
      setGramsAmount(calculatedWeight);
      setWeightInput(calculatedWeight.toFixed(2));
    }
  };

  // Swap weight and value inputs
  const handleSwap = () => {
    const tempWeight = weightInput;
    const tempValue = valueInput;
    setWeightInput(tempValue);
    setValueInput(tempWeight);

    const parsedValue = parseFloat(tempValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      const currentPrice = metalType === "gold" ? goldPrice : silverPrice;
      const calculatedWeight = parsedValue / currentPrice;
      setGramsAmount(calculatedWeight);
    }
  };

  // Get coin balance
  const getCoinBalance = (grams: number) => {
    if (!Array.isArray(coinInventory)) return 0;
    const inv = coinInventory.find((c) => c.coinGrams === grams);
    return inv?.quantity || 0;
  };

  // Check if user has any coins at all
  const totalCoinBalance = () => {
    if (!Array.isArray(coinInventory)) return 0;
    return coinInventory.reduce((sum, c) => sum + (c.quantity || 0), 0);
  };

  const occasions = [
    {
      id: "birthday",
      label: "🎂 Birthday",
      color: metalType === "gold" ? "from-amber-500 to-yellow-500" : "from-gray-400 to-gray-500",
    },
    {
      id: "wedding",
      label: "💍 Wedding",
      color: metalType === "gold" ? "from-amber-600 to-yellow-600" : "from-gray-500 to-gray-600",
    },
    {
      id: "anniversary",
      label: "❤️ Anniversary",
      color: metalType === "gold" ? "from-amber-500 to-yellow-500" : "from-gray-400 to-gray-500",
    },
    {
      id: "diwali",
      label: "🪔 Diwali",
      color: metalType === "gold" ? "from-orange-500 to-amber-500" : "from-gray-500 to-gray-600",
    },
    {
      id: "general",
      label: "🎁 General",
      color: metalType === "gold" ? "from-amber-400 to-yellow-500" : "from-gray-400 to-gray-500",
    },
  ];

  const presetGrams = [0.1, 0.25, 0.5, 1, 2];
  const coinDenominations: (1 | 2 | 5 | 10)[] = [1, 2, 5, 10];

  // Validate phone number - 10 digits only
  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length === 10;
  };

  const handleSendGift = async () => {
    if (!validatePhoneNumber(recipientPhone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, unknown> = {
        recipientName,
        recipientPhone,
        message: personalMessage,
        occasion,
        metalType, // Add metal type
        formType,  // Add form type
        giftType,
      };

      if (giftType === "grams") {
        payload.goldGrams = gramsAmount;
      } else {
        payload.coinGrams = selectedCoin;
        payload.coinQuantity = coinQuantity;
      }

      const response = await fetch(`${API_URL}/gold-gifts/send`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        } as HeadersInit,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || `${metalType === "gold" ? "Gold" : "Silver"} gift sent successfully! 🎉`);
        onClose();
      } else {
        toast.error(
          data.message || "Failed to send gift. Please check your balance.",
        );
      }
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("An error occurred while sending the gift.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get metal-specific colors
  const getMetalColors = () => {
    if (metalType === "gold") {
      return {
        primary: "from-amber-500 to-yellow-600",
        primaryLight: "from-amber-400 to-yellow-500",
        primaryHover: "hover:from-amber-600 hover:to-yellow-700",
        text: "text-amber-600",
        textDark: "text-amber-400",
        border: "border-amber-500",
        bg: "bg-amber-50",
        bgDark: "dark:bg-amber-900/20",
        ring: "focus:border-amber-500",
        ringDark: "dark:focus:border-amber-400",
      };
    } else {
      return {
        primary: "from-gray-400 to-gray-500",
        primaryLight: "from-gray-300 to-gray-400",
        primaryHover: "hover:from-gray-500 hover:to-gray-600",
        text: "text-gray-600",
        textDark: "text-gray-400",
        border: "border-gray-500",
        bg: "bg-gray-50",
        bgDark: "dark:bg-gray-800/20",
        ring: "focus:border-gray-500",
        ringDark: "dark:focus:border-gray-400",
      };
    }
  };

  const metalColors = getMetalColors();

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/60 dark:bg-black/60">
      <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
      <div className="zold-hide-scrollbar h-[95vh] sm:h-[95vh] w-[100vw] max-w-lg overflow-y-auto bg-gray-50 dark:bg-neutral-800 rounded-b-[2rem] rounded-t-[2rem]">
        {/* Header - Dynamic based on metal type */}
        <div className={`sticky top-0 bg-gradient-to-r ${metalColors.primary} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white capitalize">
                  Gift {metalType}
                </h2>
                <p className="text-sm text-white/80">
                  Send {metalType} to loved ones
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

        <div className="p-4">
          {/* Step Indicator - Fixed with wrapping */}
          <div className="mb-6 mt-2">
            <div className="grid grid-cols-5 gap-1 sm:flex sm:items-center sm:justify-between">
              {/* Step 1: Metal */}
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm ${step === "metal"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  1
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${step === "metal" ? "text-black dark:text-white font-medium" : "text-gray-400 dark:text-neutral-500"
                  }`}>
                  Metal
                </span>
              </div>

              {/* Connector Line - Hidden on mobile, visible on sm */}
              <div className="hidden sm:block sm:mx-1 md:mx-2 h-px flex-1 bg-gray-200 dark:bg-neutral-700"></div>

              {/* Step 2: Form */}
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm ${step === "form"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  2
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${step === "form" ? "text-black dark:text-white font-medium" : "text-gray-400 dark:text-neutral-500"
                  }`}>
                  Form
                </span>
              </div>

              {/* Connector Line */}
              <div className="hidden sm:block sm:mx-1 md:mx-2 h-px flex-1 bg-gray-200 dark:bg-neutral-700"></div>

              {/* Step 3: Amount */}
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm ${step === "amount"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  3
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${step === "amount" ? "text-black dark:text-white font-medium" : "text-gray-400 dark:text-neutral-500"
                  }`}>
                  Amount
                </span>
              </div>

              {/* Connector Line */}
              <div className="hidden sm:block sm:mx-1 md:mx-2 h-px flex-1 bg-gray-200 dark:bg-neutral-700"></div>

              {/* Step 4: Recipient */}
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm ${step === "recipient"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  4
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${step === "recipient" ? "text-black dark:text-white font-medium" : "text-gray-400 dark:text-neutral-500"
                  }`}>
                  Recipient
                </span>
              </div>

              {/* Connector Line */}
              <div className="hidden sm:block sm:mx-1 md:mx-2 h-px flex-1 bg-gray-200 dark:bg-neutral-700"></div>

              {/* Step 5: Message */}
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm ${step === "message" || step === "confirm"
                    ? "bg-black text-white"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-400"
                    }`}
                >
                  5
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${step === "message" || step === "confirm" ? "text-black dark:text-white font-medium" : "text-gray-400 dark:text-neutral-500"
                  }`}>
                  Message
                </span>
              </div>
            </div>

            {/* Mobile-friendly step description */}
            <div className="mt-2 text-center sm:hidden">
              <span className="text-xs font-medium text-black dark:text-white capitalize">
                Step {step === "metal" ? "1" : step === "form" ? "2" : step === "amount" ? "3" : step === "recipient" ? "4" : "5"}: {step}
              </span>
            </div>
          </div>

          {/* Step 1: Metal Selection (Gold or Silver) */}
          {step === "metal" && (
            <div>
              <h3 className="mb-4 font-bold text-gray-600 dark:text-white">
                Select Metal Type
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Gold Option */}
                <button
                  onClick={() => {
                    setMetalType("gold");
                  }}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${metalType === "gold"
                    ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-neutral-700"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                    }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${metalType === "gold"
                      ? "bg-gradient-to-br from-amber-400 to-yellow-600"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}>
                      <Gem className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Gold
                    </span>
                    <span className="text-sm text-gray-500 dark:text-neutral-400">
                      24K Pure Gold
                    </span>
                    <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      ₹{goldPrice}/g
                    </span>
                  </div>
                  {metalType === "gold" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-6 w-6 text-amber-500" />
                    </div>
                  )}
                </button>

                {/* Silver Option */}
                <button
                  onClick={() => {
                    setMetalType("silver");
                  }}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${metalType === "silver"
                    ? "border-gray-500 bg-gray-50 dark:border-gray-400 dark:bg-neutral-700"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                    }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${metalType === "silver"
                      ? "bg-gradient-to-br from-gray-400 to-gray-500"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}>
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Silver
                    </span>
                    <span className="text-sm text-gray-500 dark:text-neutral-400">
                      Pure Silver
                    </span>
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                      ₹{silverPrice}/g
                    </span>
                  </div>
                  {metalType === "silver" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </button>
              </div>

              <button
                onClick={() => setStep("form")}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white text-xs sm:text-sm transition-colors ${metalColors.primaryHover}`}
              >
                <span>Next: Choose Form</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Form Selection (Raw or Bar) */}
          {step === "form" && (
            <div>
              <h3 className="mb-4 font-bold text-gray-600 dark:text-white">
                Select Form
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Raw Form Option */}
                <button
                  onClick={() => {
                    setFormType("raw");
                    setGiftType("grams");
                  }}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${formType === "raw"
                    ? `border-${metalColors.border} ${metalColors.bg} dark:bg-neutral-700`
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                    }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${formType === "raw"
                      ? `bg-gradient-to-br ${metalColors.primary}`
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}>
                      <Scale className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Raw
                    </span>
                    <span className="text-sm text-gray-500 dark:text-neutral-400 text-center">
                      By weight • Any amount
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Flexible grams
                    </span>
                  </div>
                  {formType === "raw" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className={`h-6 w-6 ${metalColors.text}`} />
                    </div>
                  )}
                </button>

                {/* Bar/Coin Form Option */}
                <button
                  onClick={() => {
                    setFormType("bar");
                    setGiftType("coins");
                  }}
                  className={`relative rounded-2xl border-2 p-6 transition-all ${formType === "bar"
                    ? `border-${metalColors.border} ${metalColors.bg} dark:bg-neutral-700`
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                    }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${formType === "bar"
                      ? `bg-gradient-to-br ${metalColors.primary}`
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}>
                      <CircleDot className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Bar/Coin
                    </span>
                    <span className="text-sm text-gray-500 dark:text-neutral-400 text-center">
                      Pre-set weights
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      1g, 2g, 5g, 10g
                    </span>
                  </div>
                  {formType === "bar" && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className={`h-6 w-6 ${metalColors.text}`} />
                    </div>
                  )}
                </button>
              </div>

              {/* Description based on selection */}
              <div className={`mt-4 rounded-xl border ${metalColors.border} ${metalColors.bg} ${metalColors.bgDark} p-4`}>
                <p className={`text-sm ${metalColors.text} dark:${metalColors.textDark}`}>
                  {formType === "raw"
                    ? `You can gift any amount of ${metalType} by weight. Perfect for flexible gifting.`
                    : `You can gift ${metalType} in pre-set bar/coin denominations. Available in standard weights.`}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep("metal")}
                  className="flex-1 rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("amount")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white transition-colors ${metalColors.primaryHover}`}
                >
                  <span>Next: Amount</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Amount Selection */}
          {step === "amount" && (
            <div>
              {/* Selected metal and form summary */}
              <div className={`mb-4 rounded-xl ${metalColors.bg} ${metalColors.bgDark} p-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">Selected:</span>
                  <span className={`text-sm font-semibold capitalize ${metalColors.text} dark:${metalColors.textDark}`}>
                    {metalType} • {formType}
                  </span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className={`text-xs ${metalColors.text} dark:${metalColors.textDark} underline`}
                >
                  Change
                </button>
              </div>

              {/* Select Occasion */}
              <div className="mb-6">
                <h3 className="mb-3 font-bold text-gray-600 dark:text-white">
                  Select Occasion
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => setOccasion(occ.id)}
                      className={`rounded-xl border-2 p-2 transition-all ${occasion === occ.id
                        ? `${metalColors.border} ${metalColors.bg} dark:border-${metalColors.border} dark:bg-neutral-700`
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                        }`}
                    >
                      <p className="text-sm text-gray-600 font-semibold dark:text-white">
                        {occ.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Amount Based on Form Type */}
              {formType === "raw" ? (
                <>
                  <div className={`mb-4 rounded-2xl bg-gradient-to-br ${metalColors.primary} p-3 text-white`}>
                    <div className="space-y-3">
                      {/* Weight Input */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="mb-1 block text-xs text-white/80">Weight (grams)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={weightInput}
                            onChange={(e) => handleWeightChange(e.target.value)}
                            className="w-full rounded-lg bg-gray-50/20 px-3 py-2 text-left text-sm font-bold text-white outline-none"
                          />
                        </div>

                        {/* Swap Button */}
                        <button

                          className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50/20 hover:bg-gray-50/30 transition-colors"
                        >
                          <ArrowLeftRight className="h-5 w-5 text-white" />
                        </button>

                        {/* Value Input */}
                        <div className="flex-1">
                          <label className="mb-1 block text-xs text-white/80">Value (₹)</label>
                          <input
                            type="number"
                            step="1"
                            value={valueInput}
                            onChange={(e) => handleValueChange(e.target.value)}
                            className="w-full rounded-lg bg-gray-50/20 px-3 py-2 text-left text-sm font-bold text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Grams */}
                  <div>
                    <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                      Pick Weight
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {presetGrams.map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            const currentPrice = metalType === "gold" ? goldPrice : silverPrice;
                            const value = g * currentPrice;

                            setInputMode("weight");     // 🔥 weight is source
                            setSelectedAmount(null);
                            setGramsAmount(g);
                            setWeightInput(g.toString());
                            setValueInput(value.toFixed(2));
                          }}
                          className={`rounded-lg border-2 py-3 text-xs sm:text-sm transition-all ${gramsAmount === g
                            ? `${metalColors.border} ${metalColors.bg} ${metalColors.text} dark:bg-neutral-700 dark:${metalColors.textDark}`
                            : "border-gray-200 bg-gray-50 text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            }`}
                        >
                          {g}g
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-neutral-400">
                      Pick Amount
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setFromAmount(amt)}
                          className={`rounded-lg border-2 py-3 text-xs sm:text-sm transition-all ${selectedAmount === amt
                            ? `${metalColors.border} ${metalColors.bg} ${metalColors.text} dark:bg-neutral-700 dark:${metalColors.textDark}`
                            : "border-gray-200 bg-gray-50 text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Bar/Coin Form
                <>
                  {totalCoinBalance() === 0 ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-700">
                        <Coins className="h-10 w-10 text-gray-400 dark:text-neutral-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                        No {metalType === "gold" ? "Gold" : "Silver"} Coins Available
                      </h4>
                      <p className="mb-6 text-sm text-gray-500 dark:text-neutral-400">
                        You don't have any {metalType} coins in your inventory. Buy
                        coins first to gift them.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/${metalType === "gold" ? "coins" : "silver-coins"}`);
                        }}
                        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} px-6 py-3 font-semibold text-white transition-all ${metalColors.primaryHover}`}
                      >
                        <Coins className="h-5 w-5" />
                        Buy {metalType === "gold" ? "Gold" : "Silver"} Coins
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        {coinDenominations.map((coin) => {
                          const balance = getCoinBalance(coin);
                          return (
                            <button
                              key={coin}
                              onClick={() => {
                                setSelectedCoin(coin);
                                setCoinQuantity(Math.min(1, balance));
                              }}
                              disabled={balance === 0}
                              className={`relative rounded-xl border-2 p-4 transition-all ${selectedCoin === coin && balance > 0
                                ? `${metalColors.border} ${metalColors.bg} dark:border-${metalColors.border} dark:bg-neutral-700`
                                : balance === 0
                                  ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50 dark:border-neutral-700 dark:bg-neutral-800"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
                                }`}
                            >
                              <div className="mb-2 flex items-center justify-center">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-full ${selectedCoin === coin && balance > 0
                                    ? `bg-gradient-to-br ${metalColors.primary}`
                                    : "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-neutral-500 dark:to-neutral-600"
                                    }`}
                                >
                                  <span className="font-bold text-white">
                                    {coin}g
                                  </span>
                                </div>
                              </div>
                              <p className="text-center font-semibold text-gray-900 dark:text-white">
                                {coin} Gram {metalType === "gold" ? "Coin" : "Bar"}
                              </p>
                              <p
                                className={`text-center text-xs ${balance === 0 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}
                              >
                                {balance === 0
                                  ? "Not Available"
                                  : `${balance} Available`}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quantity Selector */}
                      {getCoinBalance(selectedCoin) > 0 && (
                        <div className={`rounded-2xl bg-gradient-to-br ${metalColors.primary} p-4 text-white`}>
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-white/80">Quantity</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  setCoinQuantity(
                                    Math.max(1, coinQuantity - 1),
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50/20 hover:bg-gray-50/30"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-2xl font-bold">
                                {coinQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  setCoinQuantity(
                                    Math.min(
                                      getCoinBalance(selectedCoin),
                                      coinQuantity + 1,
                                    ),
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50/20 hover:bg-gray-50/30"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/80">Total {metalType === "gold" ? "Gold" : "Silver"}</span>
                            <span>{displayValues.grams} grams</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-sm">
                            <span className="text-white/80">Value</span>
                            <span>₹{displayValues.amount}</span>
                          </div>
                        </div>
                      )}

                      {/* Message if selected coin has no balance */}
                      {getCoinBalance(selectedCoin) === 0 && (
                        <div className={`rounded-xl border ${metalColors.border} ${metalColors.bg} ${metalColors.bgDark} p-4`}>
                          <p className={`text-sm ${metalColors.text} dark:${metalColors.textDark}`}>
                            You don't have any {selectedCoin}g {metalType} coins. Select a
                            different coin or buy more coins.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (formType === "bar" && getCoinBalance(selectedCoin) === 0) {
                      toast.error("Please select an available coin");
                      return;
                    }
                    setStep("recipient");
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white transition-colors ${metalColors.primaryHover}`}
                >
                  <span>Next: Recipient</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Recipient Details */}
          {step === "recipient" && (
            <div>
              {/* Selected summary */}
              <div className={`mb-4 rounded-xl ${metalColors.bg} ${metalColors.bgDark} p-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">Gift:</span>
                  <span className={`text-sm font-semibold capitalize ${metalColors.text} dark:${metalColors.textDark}`}>
                    {metalType} • {formType} • ₹{displayValues.amount}
                  </span>
                </div>
                <button
                  onClick={() => setStep("amount")}
                  className={`text-xs ${metalColors.text} dark:${metalColors.textDark} underline`}
                >
                  Change
                </button>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 font-semibold text-gray-600 dark:text-white">
                  Recipient Details
                </h3>

                <div className="space-y-4">
                  {/* Mobile Number */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-500 dark:text-neutral-300">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => {
                          const phone = e.target.value;
                          const digitsOnly = phone.replace(/\D/g, "").slice(0, 10);
                          setRecipientPhone(digitsOnly);
                          setLookupResult(null);

                          if (digitsOnly.length === 10) {
                            setIsLookingUp(true);
                            fetch(
                              `${API_URL}/gold-gifts/lookup?phone=${encodeURIComponent(digitsOnly)}`,
                              {
                                headers: getAuthHeaders() as HeadersInit,
                              },
                            )
                              .then((res) => res.json())
                              .then((data) => {
                                if (data.success) {
                                  setLookupResult({
                                    found: data.found,
                                    name: data.data?.name,
                                    email: data.data?.email,
                                    id: data.data?.id,
                                    message: data.message,
                                  });
                                  if (data.found && data.data?.name) {
                                    setRecipientName(data.data.name);
                                  }
                                }
                              })
                              .catch(console.error)
                              .finally(() => setIsLookingUp(false));
                          }
                        }}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full rounded-xl border border-gray-300 py-3 pr-12 pl-11 text-gray-900 focus:outline-none ${metalColors.ring} dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:${metalColors.ringDark}`}
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        {isLookingUp && (
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        )}
                        {!isLookingUp && lookupResult?.found && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    {recipientPhone.length > 0 && recipientPhone.length < 10 && (
                      <p className="mt-1 text-xs text-amber-600">
                        Please enter 10 digits
                      </p>
                    )}
                  </div>

                  {/* User Found Card */}
                  {lookupResult?.found && (
                    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30">
                          <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-300">
                            {lookupResult.name}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            ZOLD User • {lookupResult.email || "Verified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* New User Card */}
                  {lookupResult && !lookupResult.found && (
                    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30">
                          <UserPlus className="h-6 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-900/80 dark:text-amber-300">
                            New User
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            {lookupResult.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient Name */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-500 dark:text-neutral-300">
                      Recipient Name{" "}
                      {lookupResult?.found && (
                        <span className="text-green-600">(Auto-filled)</span>
                      )}
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Enter name"
                        readOnly={lookupResult?.found}
                        className={`w-full rounded-xl border py-3 pr-4 pl-11 focus:outline-none ${lookupResult?.found
                          ? "border-green-300 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : `border-gray-300 text-gray-800 ${metalColors.ring} dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:${metalColors.ringDark}`
                          }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    {lookupResult?.found
                      ? "This user is already on ZOLD. The gift will be credited directly to their wallet."
                      : "The recipient will receive an SMS with a link to claim their gift. If they don't have a ZOLD account, they'll be guided to create one."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("amount")}
                  className="flex-1 rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!validatePhoneNumber(recipientPhone)) {
                      toast.error("Please enter a valid 10-digit mobile number");
                      return;
                    }
                    setStep("message");
                  }}
                  disabled={!recipientName || !validatePhoneNumber(recipientPhone)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white transition-colors ${metalColors.primaryHover} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Personal Message */}
          {step === "message" && (
            <div>
              <div className="mb-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Add Personal Message
                </h3>

                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write your wishes... (optional)"
                  rows={4}
                  className={`w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none ${metalColors.ring} dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:${metalColors.ringDark}`}
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                  {personalMessage.length}/200 characters
                </p>

                {/* Preview Card */}
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Preview
                  </h4>
                  <div
                    className={`bg-gradient-to-br ${occasions.find((o) => o.id === occasion)?.color} rounded-2xl p-6 text-white`}
                  >
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50/20 backdrop-blur-sm">
                        {formType === "bar" ? (
                          <Coins className="h-8 w-8 text-white" />
                        ) : (
                          <Gift className="h-8 w-8 text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="mb-2 text-center font-semibold">
                      You've received a {metalType} {formType === "bar" ? "coin" : "gift"}!
                    </h3>
                    <p className="mb-4 text-center text-sm text-white/90">
                      {currentUserName || "Someone"} gifted you{" "}
                      {formType === "bar"
                        ? displayValues.coins
                        : `${displayValues.grams}g`}{" "}
                      of {metalType === "gold" ? "24K gold" : "pure silver"} (₹{displayValues.amount})
                    </p>
                    {personalMessage && (
                      <div className="rounded-xl bg-gray-50/20 p-3 backdrop-blur-sm">
                        <p className="text-sm text-white/90 italic">
                          "{personalMessage}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("recipient")}
                  className="flex-1 rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white transition-colors ${metalColors.primaryHover}`}
                >
                  <span>Review</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === "confirm" && (
            <div>
              <div className="mb-6">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Confirm Gift Details
                </h3>

                <div className="mb-6 space-y-3">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                    <p className="mb-1 text-sm text-gray-500 dark:text-neutral-400">
                      Gift Type
                    </p>
                    <p className="font-medium text-gray-900 capitalize dark:text-white">
                      {metalType} • {formType === "bar" ? displayValues.coins : "Raw"} • {formType === "bar" ? "Coin" : "By Weight"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                    <p className="mb-1 text-sm text-gray-500 dark:text-neutral-400">
                      Occasion
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {occasions.find((o) => o.id === occasion)?.label}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                    <p className="mb-1 text-sm text-gray-500 dark:text-neutral-400">
                      Recipient
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {recipientName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-neutral-500">
                      {recipientPhone}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                    <p className="mb-1 text-sm text-gray-500 dark:text-neutral-400">
                      Gift Amount
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{displayValues.amount} ({displayValues.grams}g {metalType})
                    </p>
                  </div>
                </div>

                <div className={`mb-6 rounded-xl border ${metalColors.border} ${metalColors.bg} ${metalColors.bgDark} p-4`}>
                  <p className={`text-xs ${metalColors.text} dark:${metalColors.textDark}`}>
                    {formType === "bar"
                      ? `The ${metalType} coins will be debited from your inventory. The recipient will receive an SMS with instructions to claim their gift.`
                      : `The gift amount will be debited from your ${metalType} wallet. The recipient will receive an SMS with instructions to claim their gift.`}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("message")}
                  className="flex-1 rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  onClick={handleSendGift}
                  disabled={isLoading}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${metalColors.primary} py-4 font-semibold text-white transition-colors ${metalColors.primaryHover}`}
                >
                  {isLoading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Gift</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}