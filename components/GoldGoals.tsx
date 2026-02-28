import { useState, useEffect } from "react";
import {
  X,
  Target,
  TrendingUp,
  Calendar,
  Coins,
  Plus,
  Edit2,
  Trash2,
  Gift,
  Bell,
  Home as HomeIcon,
  Sparkles,
  PartyPopper,
  Check,
  ChevronRight,
  Repeat,
  Award,
  Repeat2,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetGrams: number;
  currentGrams: number;
  deadline: string;
  category:
  | "wedding"
  | "festival"
  | "emergency"
  | "investment"
  | "gift"
  | "custom";
  icon: string;
  color: string;
  createdAt: string;
  autoAllocate: boolean;
  notifications: boolean; // Added notifications field
}

interface GoldGoalsProps {
  onClose: () => void;
  mode?: "create" | "view" | "manage";
  onBuyGold?: () => void;
}

// Auspecious days for gold purchase
const AUSPECIOUS_DAYS = [
  {
    name: "Akshaya Tritiya",
    date: "2024-05-10",
    description: "Most auspicious day to buy gold",
    multiplier: 1.2,
  },
  {
    name: "Dhanteras",
    date: "2024-10-29",
    description: "Buy gold for wealth and prosperity",
    multiplier: 1.15,
  },
  {
    name: "Vijayadashami",
    date: "2024-10-12",
    description: "Victory day - auspicious for investments",
    multiplier: 1.1,
  },
  {
    name: "Gudi Padwa",
    date: "2024-04-09",
    description: "New Year - start with gold",
    multiplier: 1.08,
  },
  {
    name: "Diwali",
    date: "2024-11-01",
    description: "Festival of lights - best time to buy",
    multiplier: 1.25,
  },
];

export function GoldGoals({
  onClose,
  mode = "view",
  onBuyGold,
}: GoldGoalsProps) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Form states for creating new goal
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState(100000);
  const [targetGrams, setTargetGrams] = useState(16.01); // 100000 / 6245.5
  const [deadline, setDeadline] = useState("2025-12-31");
  const [category, setCategory] = useState<Goal["category"]>("wedding");

  // Separate states for auto-allocate and notifications
  const [autoAllocate, setAutoAllocate] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState<
    "monthly" | "yearly" | "quarterly"
  >("monthly");
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1); // 1-4 for quarters

  const goldPrice = 6245.5; // In a real app, this should come from context or API

  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/gold-goals`, {
        headers: getAuthHeaders() as HeadersInit,
      });
      const data = await response.json();
      if (data.success) {
        setGoals(data.data);
      } else {
        toast.error("Failed to fetch goals");
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Error fetching goals");
    }
  };

  const goalCategories = [
    {
      id: "wedding",
      name: "Wedding",
      icon: "💍",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "festival",
      name: "Festival",
      icon: "🪔",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: "🛡️",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "investment",
      name: "Investment",
      icon: "📈",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "gift",
      name: "Gift",
      icon: "🎁",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "custom",
      name: "Custom",
      icon: "⭐",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const handleCreateGoal = async () => {
    if (!goalName || !targetAmount || !deadline) return;
    setIsLoading(true);

    try {
      const selectedCategory = goalCategories.find((c) => c.id === category);
      const payload = {
        name: goalName,
        targetAmount,
        deadline,
        category,
        autoAllocate,
        notifications, // Include notifications in payload
        icon: selectedCategory?.icon || "⭐",
        color: selectedCategory?.color || "from-purple-500 to-pink-500",
      };

      const response = await fetch(`${API_URL}/gold-goals`, {
        method: "POST",
        headers: getAuthHeaders() as HeadersInit,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setGoals([data.data, ...goals]);
        toast.success(`Goal "${goalName}" created successfully! 🎯`);
        setCurrentMode("view");

        // Reset form
        setGoalName("");
        setTargetAmount(100000);
        setTargetGrams(16.01);
        setCategory("wedding");
        setAutoAllocate(false);
        setNotifications(false); // Reset notifications
      } else {
        toast.error(data.message || "Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Error creating goal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/gold-goals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders() as HeadersInit,
      });
      const data = await response.json();

      if (data.success) {
        setGoals(goals.filter((g) => g.id !== id));
        toast.success("Goal deleted successfully");
        setSelectedGoal(null);
      } else {
        toast.error(data.message || "Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Error deleting goal");
    }
  };

  const handleAddMoney = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const newCurrentAmount = goal.currentAmount + amount;

      const response = await fetch(`${API_URL}/gold-goals/${goalId}`, {
        method: "PATCH",
        headers: getAuthHeaders() as HeadersInit,
        body: JSON.stringify({ currentAmount: newCurrentAmount }),
      });

      const data = await response.json();

      if (data.success) {
        setGoals(
          goals.map((g) => {
            if (g.id === goalId) {
              return data.data;
            }
            return g;
          }),
        );

        toast.success(`₹${amount.toLocaleString()} added to your goal! 🎉`);
      } else {
        toast.error(data.message || "Failed to update goal");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Error updating goal");
    }
  };

  const getProgress = (goal: Goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMilestoneMessage = (progress: number) => {
    if (progress >= 100)
      return {
        text: "🎉 Goal Achieved!",
        color: "text-green-600 dark:text-green-500",
      };
    if (progress >= 75)
      return {
        text: "💪 Almost there!",
        color: "text-orange-600 dark:text-orange-500",
      };
    if (progress >= 50)
      return {
        text: "🔥 Halfway done!",
        color: "text-blue-600 dark:text-blue-500",
      };
    if (progress >= 25)
      return {
        text: "🌟 Great start!",
        color: "text-purple-600 dark:text-purple-500",
      };
    return {
      text: "🚀 Keep going!",
      color: "text-gray-600 dark:text-neutral-500",
    };
  };

  const getMonthsAndYearsLeft = () => {
    const today = new Date();
    const target = new Date(deadline);

    const diffTime = target.getTime() - today.getTime();
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const months = Math.max(1, Math.ceil(totalDays / 30));
    const years = Math.max(1, Math.ceil(totalDays / 365));
    const quarters = Math.max(1, Math.ceil(totalDays / 91)); // ~91 days per quarter

    return { months, years, quarters, totalDays };
  };

  const getInstallmentAmount = () => {
    const { months, years, quarters } = getMonthsAndYearsLeft();

    switch (paymentFrequency) {
      case "monthly":
        return targetAmount / months;
      case "yearly":
        return targetAmount / years;
      case "quarterly":
        return targetAmount / quarters;
      default:
        return targetAmount / months;
    }
  };

  const getTimeLeftBreakdown = () => {
    const today = new Date();
    const target = new Date(deadline);

    if (target <= today) {
      return { months: 0, days: 0, totalDays: 0, quarters: 0 };
    }

    let months =
      (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth());

    if (target.getDate() < today.getDate()) {
      months -= 1;
    }

    const tempDate = new Date(today);
    tempDate.setMonth(today.getMonth() + months);

    const diffTime = target.getTime() - tempDate.getTime();
    const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalDays = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const quarters = Math.max(1, Math.ceil(totalDays / 91));

    return { months, days, totalDays, quarters };
  };

  // Find next auspecious day
  const getNextAuspeciousDay = () => {
    const today = new Date();
    const upcoming = AUSPECIOUS_DAYS.map((day) => ({
      ...day,
      dateObj: new Date(day.date),
    }))
      .filter((day) => day.dateObj > today)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    if (upcoming.length > 0) {
      return upcoming[0];
    }

    // If no upcoming this year, return first of next year
    return {
      ...AUSPECIOUS_DAYS[0],
      dateObj: new Date(new Date().getFullYear() + 1, 4, 10), // Akshaya Tritiya next year
    };
  };

  const nextAuspeciousDay = getNextAuspeciousDay();

  // Handle amount change
  const handleAmountChange = (amount: number) => {
    setTargetAmount(amount);
    setTargetGrams(amount / goldPrice);
  };

  // Handle grams change
  const handleGramsChange = (grams: number) => {
    setTargetGrams(grams);
    setTargetAmount(grams * goldPrice);
  };

  // Swap values
  const handleSwap = () => {
    // Just a visual swap - the values remain consistent
    // This triggers a re-render but doesn't change actual values
    setTargetAmount(targetAmount);
    setTargetGrams(targetGrams);
  };

  // Create Goal Mode
  if (currentMode === "create") {
    const { months, years, quarters } = getMonthsAndYearsLeft();
    const installmentAmount = getInstallmentAmount();
    const timeLeft = getTimeLeftBreakdown();

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-2 dark:bg-black/70">
        <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
        <div className="zold-hide-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl rounded-b-[2rem] bg-gray-50 lg:max-h-[95vh] dark:bg-neutral-800">
          {/* Header */}
          <div className="sticky top-0 z-10 rounded-t-3xl bg-[#C9A227] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white">Create Gold Goal</h2>
                  <p className="text-sm text-white/80">
                    Set your savings target
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Auspecious Day Banner */}
            <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/40">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Next Auspecious Day: {nextAuspeciousDay.name}
                  </p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {nextAuspeciousDay.dateObj.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • {nextAuspeciousDay.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-amber-200 px-2 py-1 text-xs text-amber-800 dark:bg-amber-800 dark:text-amber-300">
                      Auto-allocate boost: +
                      {(nextAuspeciousDay.multiplier - 1) * 100}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Name */}
            <div className="mb-5">
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Goal Name
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Wedding Jewellery, Diwali Gold"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:border-[#C9A227] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:border-[#8B7FA8]"
                disabled={isLoading}
              />
            </div>

            {/* Category Selection */}
            <div className="mb-5">
              <label className="mb-3 block text-gray-700 dark:text-neutral-300">
                Goal Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {goalCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Goal["category"])}
                    className={`rounded-xl border-2 p-4 transition-all ${category === cat.id
                      ? "border-[#C9A227] bg-purple-50 dark:border-[#8B7FA8] dark:bg-neutral-700"
                      : "border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                      }`}
                    disabled={isLoading}
                  >
                    <div className="mb-2 text-3xl">{cat.icon}</div>
                    <p className="text-xs text-gray-700 dark:text-neutral-300">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Amount and Grams with Swap Icon */}
            <div className="mb-5">
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Target Amount
              </label>
              <div className="flex items-center gap-2">
                {/* Amount Input */}
                <div className="relative flex-1">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-neutral-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={Math.round(targetAmount)}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-8 text-gray-800 focus:border-[#C9A227] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:border-[#8B7FA8]"
                    min="1000"
                    step="1000"
                    disabled={isLoading}
                  />
                </div>

                {/* Swap Icon */}
                <button
                  onClick={handleSwap}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                  disabled={isLoading}
                >
                  <Repeat2 className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                </button>

                {/* Grams Input */}
                <div className="relative flex-1">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-neutral-400">
                    g
                  </span>
                  <input
                    type="number"
                    value={targetGrams.toFixed(3)}
                    onChange={(e) => handleGramsChange(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-8 text-gray-800 focus:border-[#C9A227] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:border-[#8B7FA8]"
                    min="0.1"
                    step="0.1"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                1g = ₹{goldPrice.toLocaleString()}
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="mb-5 grid grid-cols-4 gap-2">
              {[50000, 100000, 250000, 500000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountChange(amount)}
                  className={`rounded-lg px-3 py-2 text-sm transition-all ${Math.abs(targetAmount - amount) < 100
                    ? "bg-[#C9A227] text-white dark:bg-[#4D3F7F]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                    }`}
                  disabled={isLoading}
                >
                  {amount >= 100000
                    ? `₹${amount / 100000}L`
                    : `₹${amount / 1000}k`}
                </button>
              ))}
            </div>

            {/* Preset Grams */}
            <div className="mb-5 grid grid-cols-4 gap-2">
              {[5, 10, 25, 50].map((grams) => (
                <button
                  key={grams}
                  onClick={() => handleGramsChange(grams)}
                  className={`rounded-lg px-3 py-2 text-sm transition-all ${Math.abs(targetGrams - grams) < 1
                    ? "bg-[#C9A227] text-white dark:bg-[#4D3F7F]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                    }`}
                  disabled={isLoading}
                >
                  {grams}g
                </button>
              ))}
            </div>

            {/* Payment Frequency with Quarterly */}
            <div className="mb-5">
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Contribution Frequency
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentFrequency("monthly")}
                  className={`flex-1 rounded-xl border py-3 text-sm ${paymentFrequency === "monthly"
                    ? "border-[#C9A227] bg-[#C9A227] text-white"
                    : "border-gray-300 text-gray-700 dark:border-neutral-600 dark:text-neutral-300"
                    }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentFrequency("quarterly")}
                  className={`flex-1 rounded-xl border py-3 text-sm ${paymentFrequency === "quarterly"
                    ? "border-[#C9A227] bg-[#C9A227] text-white"
                    : "border-gray-300 text-gray-700 dark:border-neutral-600 dark:text-neutral-300"
                    }`}
                >
                  Quarterly
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentFrequency("yearly")}
                  className={`flex-1 rounded-xl border py-3 text-sm ${paymentFrequency === "yearly"
                    ? "border-[#C9A227] bg-[#C9A227] text-white"
                    : "border-gray-300 text-gray-700 dark:border-neutral-600 dark:text-neutral-300"
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Quarter Selection (if quarterly selected) */}
            {paymentFrequency === "quarterly" && (
              <div className="mb-5">
                <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                  Select Quarter
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((quarter) => (
                    <button
                      key={quarter}
                      onClick={() => setSelectedQuarter(quarter)}
                      className={`rounded-xl border py-3 text-sm ${selectedQuarter === quarter
                        ? "border-[#C9A227] bg-[#C9A227] text-white"
                        : "border-gray-300 text-gray-700 dark:border-neutral-600 dark:text-neutral-300"
                        }`}
                    >
                      Q{quarter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Deadline */}
            <div className="mb-5">
              <label className="mb-2 block text-gray-700 dark:text-neutral-300">
                Target Date
              </label>
              <div className="relative">
                <Calendar className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-gray-800 focus:border-[#C9A227] focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:focus:border-[#8B7FA8]"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Installment Breakdown */}
            <div className="mb-6 rounded-xl border border-[#E0DAF2] bg-[#F4F1FA] p-4 dark:border-neutral-600 dark:bg-neutral-700">
              <p className="mb-2 font-medium text-gray-800 dark:text-white">
                Installment Details
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-neutral-400">
                    {paymentFrequency === "monthly"
                      ? "Monthly"
                      : paymentFrequency === "quarterly"
                        ? "Quarterly"
                        : "Yearly"}{" "}
                    Installment:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹
                    {installmentAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ({(installmentAmount / goldPrice).toFixed(3)}g)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Total{" "}
                    {paymentFrequency === "monthly"
                      ? "months"
                      : paymentFrequency === "quarterly"
                        ? "quarters"
                        : "years"}
                    :
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentFrequency === "monthly" && months}{" "}
                    {paymentFrequency === "monthly"
                      ? "months"
                      : paymentFrequency === "quarterly"
                        ? quarters + " quarters"
                        : years + " years"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Time Remaining:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {timeLeft.months} months {timeLeft.days} days
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-Allocate with Auspecious Day Integration - Separate Toggle */}
            <div className="mb-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-4 dark:border-neutral-600 dark:bg-neutral-700">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#C9A227] dark:text-[#8B7FA8]" />
                  <p className="text-gray-900 dark:text-white">
                    Auto-Allocate Purchases
                  </p>
                </div>
                <button
                  onClick={() => setAutoAllocate(!autoAllocate)}
                  className={`relative h-7 w-14 rounded-full transition-colors ${autoAllocate
                    ? "bg-[#C9A227] dark:bg-[#4D3F7F]"
                    : "bg-gray-300 dark:bg-neutral-600"
                    }`}
                  disabled={isLoading}
                >
                  <div
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform dark:bg-neutral-300 ${autoAllocate ? "translate-x-7" : ""
                      }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-400">
                Automatically add a portion of your gold purchases to this goal
              </p>
              {autoAllocate && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                  <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-green-700 dark:text-green-400">
                    On {nextAuspeciousDay.name}, allocation will be boosted by{" "}
                    {(nextAuspeciousDay.multiplier - 1) * 100}%
                  </p>
                </div>
              )}
            </div>

            {/* Notifications - Separate Toggle with its own state and function */}
            <div className="mb-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 dark:border-neutral-600 dark:bg-neutral-700">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-gray-900 dark:text-white">
                    Goal Notifications
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative h-7 w-14 rounded-full transition-colors ${notifications
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-300 dark:bg-neutral-600"
                    }`}
                  disabled={isLoading}
                >
                  <div
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform dark:bg-neutral-300 ${notifications ? "translate-x-7" : ""
                      }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-neutral-400">
                Receive notifications about goal progress, milestones, and
                upcoming auspicious days
              </p>

              {/* Notification Preview - Shows when enabled */}
              {notifications && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-neutral-800">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <p className="flex-1 text-xs text-gray-700 dark:text-neutral-300">
                      Weekly progress reports
                    </p>
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-neutral-800">
                    <Award className="h-3 w-3 text-amber-500" />
                    <p className="flex-1 text-xs text-gray-700 dark:text-neutral-300">
                      Auspicious day alerts
                    </p>
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-neutral-800">
                    <Target className="h-3 w-3 text-purple-500" />
                    <p className="flex-1 text-xs text-gray-700 dark:text-neutral-300">
                      Milestone achievements
                    </p>
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mb-6 rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
              <p className="mb-3 text-sm text-gray-700 dark:text-neutral-300">
                Goal Summary
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Target:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{targetAmount.toLocaleString()} ({targetGrams.toFixed(3)}g)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Deadline:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Days to achieve:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {timeLeft.totalDays} days
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm dark:border-neutral-600">
                  <span className="font-medium text-gray-600 dark:text-neutral-400">
                    {paymentFrequency === "monthly"
                      ? "Monthly"
                      : paymentFrequency === "quarterly"
                        ? "Quarterly"
                        : "Yearly"}{" "}
                    need:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹
                    {installmentAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    ({(installmentAmount / goldPrice).toFixed(3)}g)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Auto-Allocate:
                  </span>
                  <span
                    className={
                      autoAllocate
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-neutral-500"
                    }
                  >
                    {autoAllocate ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Notifications:
                  </span>
                  <span
                    className={
                      notifications
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-neutral-500"
                    }
                  >
                    {notifications ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentMode("view")}
                className="flex-1 rounded-xl bg-gray-100 py-4 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={!goalName || isLoading}
                className="flex flex-2 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F5D97A] to-[#D4AF37] px-6 py-4 text-white transition-all hover:opacity-90 dark:from-[#4D3F7F] dark:to-[#5C4E7F]"
              >
                <Check className="h-5 w-5" />
                <span>{isLoading ? "Creating..." : "Create Goal"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Goal Detail View
  if (selectedGoal) {
    const progress = getProgress(selectedGoal);
    const milestone = getMilestoneMessage(progress);
    const daysLeft = getDaysLeft(selectedGoal.deadline);
    const remainingAmount =
      selectedGoal.targetAmount - selectedGoal.currentAmount;

    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-2 dark:bg-black/70">
        <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
        <div className="zold-hide-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-gray-50 dark:bg-neutral-800">
          {/* Header */}
          <div
            className={`sticky top-0 bg-gradient-to-r ${selectedGoal.color} rounded-t-3xl px-6 py-5`}
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedGoal(null)}
                className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
              >
                <ChevronRight className="h-5 w-5 rotate-180 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm transition-colors hover:bg-gray-50/30">
                  <Edit2 className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => handleDeleteGoal(selectedGoal.id)}
                  className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm transition-colors hover:bg-gray-50/30"
                >
                  <Trash2 className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="mb-2 flex items-center gap-3">
              <div className="text-5xl">{selectedGoal.icon}</div>
              <div>
                <h2 className="text-white">{selectedGoal.name}</h2>
                <p className="text-sm text-white/80">
                  {selectedGoal.category.charAt(0).toUpperCase() +
                    selectedGoal.category.slice(1)}{" "}
                  Goal
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-gray-700 dark:text-neutral-300">Progress</p>
                <p className={`${milestone.color}`}>{milestone.text}</p>
              </div>
              <div className="relative mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${selectedGoal.color} transition-all duration-500`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">
                  {progress.toFixed(1)}% completed
                </span>
                <span className="text-gray-900 dark:text-white">
                  ₹{selectedGoal.currentAmount.toLocaleString()} / ₹
                  {selectedGoal.targetAmount.toLocaleString()} (
                  {selectedGoal.currentGrams.toFixed(3)}g /{" "}
                  {selectedGoal.targetGrams.toFixed(3)}g)
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                  Current Value
                </p>
                <p className="text-xl text-gray-900 dark:text-white">
                  ₹{selectedGoal.currentAmount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                  {selectedGoal.currentGrams.toFixed(3)} grams
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                  Target Value
                </p>
                <p className="text-xl text-gray-900 dark:text-white">
                  ₹{selectedGoal.targetAmount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                  {selectedGoal.targetGrams.toFixed(3)} grams
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                  Remaining
                </p>
                <p className="text-xl text-gray-900 dark:text-white">
                  ₹{remainingAmount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                  {(
                    (selectedGoal.targetAmount - selectedGoal.currentAmount) /
                    goldPrice
                  ).toFixed(3)}{" "}
                  grams
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-neutral-700">
                <p className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
                  Days Left
                </p>
                <p className="text-xl text-gray-900 dark:text-white">
                  {daysLeft}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                  Until{" "}
                  {new Date(selectedGoal.deadline).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Auspecious Day Banner */}
            <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/40">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Next Auspecious Day: {nextAuspeciousDay.name}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {nextAuspeciousDay.dateObj.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  {selectedGoal.autoAllocate && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-amber-200 px-2 py-1 text-xs text-amber-800 dark:bg-amber-800 dark:text-amber-300">
                        +{(nextAuspeciousDay.multiplier - 1) * 100}% boost on
                        this day
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Add Money */}
            <div className="mb-6">
              <p className="mb-3 text-gray-700 dark:text-neutral-300">
                Quick Add Money
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 5000, 10000, 25000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAddMoney(selectedGoal.id, amount)}
                    className="rounded-xl bg-[#C9A227] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]"
                  >
                    ₹{amount / 1000}k
                  </button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 2, 5, 10].map((grams) => (
                  <button
                    key={grams}
                    onClick={() =>
                      handleAddMoney(selectedGoal.id, grams * goldPrice)
                    }
                    className="rounded-xl bg-[#C9A227] py-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]"
                  >
                    {grams}g
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Allocate Status */}
            <div
              className={`mb-4 rounded-xl p-4 ${selectedGoal.autoAllocate ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700"}`}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className={`h-5 w-5 ${selectedGoal.autoAllocate ? "text-green-600 dark:text-green-500" : "text-gray-400 dark:text-neutral-500"}`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Auto-Allocate{" "}
                    {selectedGoal.autoAllocate ? "Active" : "Inactive"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">
                    {selectedGoal.autoAllocate
                      ? "Purchases are automatically allocated to this goal"
                      : "Enable to auto-allocate purchases"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications Status - Separate Card */}
            <div
              className={`mb-6 rounded-xl p-4 ${selectedGoal.notifications ? "border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20" : "border border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700"}`}
            >
              <div className="flex items-center gap-2">
                <Bell
                  className={`h-5 w-5 ${selectedGoal.notifications ? "text-blue-600 dark:text-blue-500" : "text-gray-400 dark:text-neutral-500"}`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Notifications{" "}
                    {selectedGoal.notifications ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">
                    {selectedGoal.notifications
                      ? "You will receive updates about this goal"
                      : "Enable to get goal updates and alerts"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onBuyGold?.();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#5C4E7F] py-4 text-white transition-all hover:opacity-90 dark:from-[#4D3F7F] dark:to-[#5C4E7F]"
              >
                <Coins className="h-5 w-5" />
                <span>Buy Gold for Goal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View - Goals List
  return (
    <div className="rounded-b-[2rem]2 fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-2 dark:bg-black/70">
      <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
      <div className="zold-hide-scrollbar h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-3xl rounded-b-[2rem] bg-gray-50 sm:h-[95vh] dark:bg-neutral-800">
        {/* Header */}
        <div className="] sticky top-0 z-1 rounded-t-3xl bg-[#C9A227] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-50/20 p-2 backdrop-blur-sm">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-bold text-white">My Gold Goals</h2>
                <p className="text-sm text-white/80">
                  {goals.length} active goals
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

        {/* Auspecious Day Banner */}
        <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 dark:border-amber-800 dark:from-amber-900/20 dark:to-yellow-900/20">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-medium">Next Auspecious Day:</span>{" "}
              {nextAuspeciousDay.name} •{" "}
              {nextAuspeciousDay.dateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Create New Goal Button */}
          <button
            onClick={() => setCurrentMode("create")}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] p-4 text-white transition-all hover:opacity-90 dark:from-[#4D3F7F] dark:to-[#5C4E7F]"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Goal</span>
          </button>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const milestone = getMilestoneMessage(progress);
              const daysLeft = getDaysLeft(goal.deadline);

              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-left transition-all hover:border-[#C9A227] hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-[#8B7FA8] dark:hover:shadow-neutral-900/50"
                >
                  <div className="mb-3 flex items-start gap-4">
                    <div
                      className={`bg-gradient-to-br ${goal.color} rounded-xl p-3 text-2xl text-white`}
                    >
                      {goal.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <span
                          className={`text-xs ${milestone.color} flex-shrink-0`}
                        >
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-gray-600 dark:text-neutral-400">
                        {goal.category.charAt(0).toUpperCase() +
                          goal.category.slice(1)}
                      </p>

                      {/* Progress Bar */}
                      <div className="relative mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                        <div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-neutral-400">
                          ₹{goal.currentAmount.toLocaleString()} / ₹
                          {goal.targetAmount.toLocaleString()} (
                          {goal.currentGrams.toFixed(2)}g /{" "}
                          {goal.targetGrams.toFixed(2)}g)
                        </span>
                        <span className="text-gray-500 dark:text-neutral-500">
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    {goal.autoAllocate && (
                      <div className="flex w-fit items-center gap-1.5 rounded bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <Sparkles className="h-3 w-3" />
                        <span>Auto-allocate</span>
                      </div>
                    )}
                    {goal.notifications && (
                      <div className="flex w-fit items-center gap-1.5 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        <Bell className="h-3 w-3" />
                        <span>Notifications</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {goals.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🎯</div>
              <h3 className="mb-2 text-gray-900 dark:text-white">
                No Goals Yet
              </h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-neutral-400">
                Create your first gold savings goal and start your journey!
              </p>
              <button
                onClick={() => setCurrentMode("create")}
                className="rounded-xl bg-gradient-to-r from-[#C9A227] to-[#C9A227] px-6 py-3 text-white transition-all hover:opacity-90 dark:from-[#4D3F7F] dark:to-[#5C4E7F]"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}