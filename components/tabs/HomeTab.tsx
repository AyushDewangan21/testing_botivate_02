"use client";
import {
  TrendingUp,
  TrendingDown,
  Coins,
  ShoppingBag,
  Gift,
  Bell,
  BarChart3,
  Users,
  Star,
  Sparkles,
  Target,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  Shield,
  Clock,
  UserIcon,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotificationsPage } from "@/components/NotificationsPage";
import zoldImg from "@/components/images/Zold.jpg";
import doubleZoldGold from "@/components/images/doubleZoldGold.png";
import doubleZoldGold2 from "@/components/images/doubleZoldGold2.png";
import doubleZoldSilver from "@/components/images/doubleZoldSIlver.png";
import sell_gold from "@/components/images/Sell-Gold.png";
import sell_silver from "@/components/images/Sell-Silver.png";
import zoldCoin from "@/components/images/zoldCoin.png";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { HomeTabSkeleton } from "@/components/skeletons/HomeTabSkeleton";
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
// Importing Quick Action Page
import { GoldGoals } from "../GoldGoals";
import { GiftGold } from "../GiftGold";
import { ReferralProgram } from "../ReferralProgram";
import JewelleryPage from "@/components/JewelleryPage";
import zoldImage from "@/components/images/Zold.jpg";
import BuyGoldImage from "@/components/images/buyGoldImage.png";
import SellGoldImage from "@/components/images/sellGoldImage.jpg";

interface HomeTabProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
  onBuyGold: () => void;
  onSellGold: () => void;
  onBuySilver?: () => void;
  onSellSilver?: () => void;
  onJewellery: () => void;
  onOpenSIPCalculator?: () => void;
  onOpenReferral?: () => void;
  onOpenGiftGold?: () => void;
  onOpenAuspiciousDays?: () => void;
  onOpenGoldGoals?: () => void;
  onOpenWalletDetails?: () => void;
}

interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  goldGrams: string;
  finalAmount: string;
  createdAt: string;
}

interface CoinInventoryItem {
  coinGrams: number;
  quantity: number;
  currentValue: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function HomeTab({
  isLoading,
  onBuyGold,
  onSellGold,
  onBuySilver,
  onSellSilver,
  onJewellery,
  onOpenReferral,
  onOpenGiftGold,
  onOpenAuspiciousDays,
  onOpenGoldGoals,
  onOpenWalletDetails,
}: HomeTabProps) {
  const router = useRouter();
  const [isInternalLoading, setIsInternalLoading] = useState(true);
  const [goldBuyPrice, setGoldBuyPrice] = useState(6245.5);
  const [goldSellPrice, setGoldSellPrice] = useState(6198.2);
  const priceChange = 1.2;
  const [userGoldGrams, setUserGoldGrams] = useState(0);
  const [userGoldValue, setUserGoldValue] = useState(0);
  const [profitToday, setProfitToday] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [totalCoins, setTotalCoins] = useState(0);
  const [coinInventory, setCoinInventory] = useState<CoinInventoryItem[]>([]);
  const [totalCoinValue, setTotalCoinValue] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showGift, setShowGift] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Function to lock body scroll
  const lockBodyScroll = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }, []);

  // Function to unlock body scroll
  const unlockBodyScroll = useCallback(() => {
    const scrollY = document.body.style.top;
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }, []);

  // Handle scroll locking for modals
  useEffect(() => {
    if (showRefer || showShop || showGoals || showNotifications) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    return () => {
      unlockBodyScroll();
    };
  }, [
    showGift,
    showRefer,
    showShop,
    showGoals,
    lockBodyScroll,
    unlockBodyScroll,
  ]);

  const fetchWalletData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsInternalLoading(false);
        return;
      }

      const results = await Promise.allSettled([
        fetch(`${API_URL}/gold/rates/current`).then((res) => res.json()),
        fetch(`${API_URL}/gold/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch(`${API_URL}/gold/wallet/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch(`${API_URL}/coins/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json()),
      ]);

      const [ratesResult, balanceResult, statsResult, coinsResult] = results;

      // Handle Rates
      if (ratesResult.status === "fulfilled" && ratesResult.value.success) {
        setGoldBuyPrice(parseFloat(ratesResult.value.data.buyRate) || 6245.5);
        setGoldSellPrice(parseFloat(ratesResult.value.data.sellRate) || 6198.2);
      }

      // Handle Balance
      if (balanceResult.status === "fulfilled" && balanceResult.value.success) {
        setUserGoldGrams(parseFloat(balanceResult.value.data.goldBalance) || 0);
        setUserGoldValue(
          parseFloat(balanceResult.value.data.currentValue) || 0,
        );
        setRecentTransactions(
          balanceResult.value.data.recentTransactions || [],
        );
      }

      // Handle Stats
      if (statsResult.status === "fulfilled" && statsResult.value.success) {
        setProfitToday(parseFloat(statsResult.value.data.profitLoss) || 0);
      }

      // Handle Inventory
      if (
        coinsResult.status === "fulfilled" &&
        coinsResult.value.success &&
        coinsResult.value.data?.inventory
      ) {
        const inventory = coinsResult.value.data.inventory.filter(
          (coin: CoinInventoryItem) => coin.quantity > 0,
        );
        setCoinInventory(inventory);
        const total = inventory.reduce(
          (sum: number, coin: CoinInventoryItem) => sum + coin.quantity,
          0,
        );
        setTotalCoins(total);
        setTotalCoinValue(parseFloat(coinsResult.value.data.totalValue) || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsInternalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();

    const socket: Socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5001",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket for live gold prices");
    });

    socket.on(
      "goldPriceUpdate",
      (data: { buyRate: number; sellRate: number; timestamp: string }) => {
        setGoldBuyPrice(data.buyRate);
        setGoldSellPrice(data.sellRate);
      },
    );

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchWalletData]);

  const [chartTimeframe, setChartTimeframe] = useState<
    "1D" | "1W" | "1M" | "1Y"
  >("1D");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const priceData = {
    "1D": [
      { time: "9AM", price: 6150 },
      { time: "11AM", price: 6175 },
      { time: "1PM", price: 6190 },
      { time: "3PM", price: 6220 },
      { time: "5PM", price: 6245 },
    ],
    "1W": [
      { time: "Mon", price: 6100 },
      { time: "Tue", price: 6120 },
      { time: "Wed", price: 6150 },
      { time: "Fri", price: 6200 },
      { time: "Sun", price: 6245 },
    ],
    "1M": [
      { time: "W1", price: 6000 },
      { time: "W2", price: 6050 },
      { time: "W3", price: 6100 },
      { time: "W4", price: 6245 },
    ],
    "1Y": [
      { time: "Jan", price: 5800 },
      { time: "Apr", price: 5950 },
      { time: "Jul", price: 6100 },
      { time: "Oct", price: 6245 },
    ],
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle sidebar close
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Calculate total portfolio value
  const totalPortfolioValue = userGoldValue + totalCoinValue;
  const totalGoldGrams =
    userGoldGrams +
    coinInventory.reduce(
      (sum, coin) => sum + coin.coinGrams * coin.quantity,
      0,
    );

  return (
    <div className="min-h-screen pb-5 dark:bg-[#FFFAE8]/20">
      {/* ═══════════════════════════════════════════════════════════════
          MOBILE SIDEBAR - Hamburger Menu (3 lines)
          ═══════════════════════════════════════════════════════════════ */}

      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 block rounded-lg border border-amber-600/20 bg-gray-50 p-2.5 shadow-md lg:hidden"
      >
        <Menu className="h-4 w-4 text-[#1a1a1a]" />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-51 h-full w-60 transform bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/02.png"
              alt="ZOLD"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-lg font-bold text-[#1a1a1a]">ZOLD Gold</span>
          </div>
          <button
            onClick={closeSidebar}
            className="h-8 w-8 rounded-full p-1.5 transition-colors"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="p-1">
          <nav className="space-y-2">


            <button
              onClick={() => {
                closeSidebar();
                onBuyGold();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Buy Gold
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onSellGold();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <TrendingDown className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Sell Gold
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                router.push("/buy-coins");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <Coins className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Gold Coins
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onOpenGoldGoals && onOpenGoldGoals();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <Target className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Gold Goals
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onOpenGiftGold && onOpenGiftGold();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <Gift className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Gift Gold
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onOpenReferral && onOpenReferral();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <Users className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Refer & Earn
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onJewellery();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <ShoppingBag className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Jewellery
              </span>
            </button>

            <button
              onClick={() => {
                closeSidebar();
                onOpenAuspiciousDays && onOpenAuspiciousDays();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-amber-50"
            >
              <Star className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                Auspicious Days
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content - Adjust padding for mobile to accommodate hamburger menu */}
      <div className="bg-[#fff9e8]/90 px-2 pt-2 pb-5 lg:px-4">
        {/* Top Bar - Adjusted for mobile with hamburger menu space */}
        <div className="mb-2 flex items-center justify-between sm:mt-2">
          <div className="ml-2 flex items-center gap-3 sm:ml-0 lg:gap-3">
            {/* Logo - Hidden on mobile to avoid overlap with hamburger menu */}
            <Image
              src="/02.png"
              alt="ZOLD"
              width={44}
              height={44}
              className="hidden object-contain lg:block"
            />
            <div className="ml-12 lg:ml-0">
              <h1 className="text-lg font-bold text-[#1a1a1a] dark:text-white">
                ZOLD Gold
              </h1>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  KYC Verified
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="relative rounded-full border-1 border-gray-800/20 bg-gray-50 p-2.5 shadow-sm transition-colors hover:shadow-md dark:bg-[#222] dark:hover:bg-[#333]"
          >
            <UserIcon className="h-4 w-4 text-[#1a1a1a] sm:h-6 sm:w-6 dark:text-white" />
          </button>
        </div>

        {/* ═════════════  LIVE GOLD RATE - Clean Two-Column  ═════════ */}
        <div className="mb-3 w-full rounded-lg">
          <div className="mt-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
              </div>

              <span className="text-[10px] font-semibold text-red-500/70 sm:text-sm">
                Live Rate
              </span>

              <span className="rounded bg-[#D4AF37]/12 px-1.5 py-0.5 text-[9px] font-bold text-[#B8960C]/80">
                24K • 999.0
              </span>
            </div>

            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${priceChange >= 0 ? "text-emerald-600/80" : "text-red-500/80"
                }`}
            >
              {priceChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {priceChange >= 0 ? "+" : ""}
              {priceChange}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* GOLD */}
            <div
              className="relative flex h-[80px] flex-col justify-between overflow-hidden rounded-xl border-2 border-[#e4cd8e]/70 bg-[radial-gradient(circle_at_center,#fdf7de_0%,#f6e7b8_40%,#edd28d_80%)] p-3 shadow-sm sm:h-[120px] sm:rounded-2xl sm:p-5"
              onClick={onBuyGold}
            >
              <div className="pointer-events-none absolute inset-0 bg-gray-50/20 opacity-40 blur-sm" />

              {/* LIVE */}
              <div className="absolute top-2 right-2 flex items-center gap-1 sm:top-3 sm:right-3">
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-90" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-red-500" />
                </span>
                <span className="text-[7px] font-bold text-red-600/60 sm:text-sm">
                  Live
                </span>
              </div>

              <div className="relative">
                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                  <h3 className="text-base font-bold text-gray-800/85 sm:text-xl">
                    GOLD
                  </h3>
                  <span className="mt-1 text-[8px] font-medium text-gray-700/80 sm:text-xs">
                    24K | 999
                  </span>
                </div>

                <div className="flex items-end">
                  <span className="text-base font-medium text-gray-900/60 sm:text-xl">
                    ₹{goldBuyPrice.toFixed(2)}
                  </span>
                  <span className="mb-0.5 text-[11px] text-gray-700/75 sm:mb-1 sm:text-sm">
                    /gm
                  </span>
                </div>
              </div>
            </div>

            {/* SILVER */}
            <div
              className="relative flex h-[80px] flex-col justify-between overflow-hidden rounded-xl border-2 border-[#cfd5de]/90 bg-[radial-gradient(circle_at_center,#F3F5F8_0%,#E1E5EB_35%,#C3CAD4_75%,#9EA8B7_100%)] p-3 shadow-lg sm:h-[120px] sm:rounded-2xl sm:p-5"
              onClick={onBuySilver}
            >
              <div className="pointer-events-none absolute inset-0 bg-gray-50/15 opacity-40 blur-sm" />

              {/* LIVE */}
              <div className="absolute top-2 right-2 flex items-center gap-1 sm:top-3 sm:right-3">
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-90" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-red-500" />
                </span>
                <span className="text-[7px] font-bold text-red-600/60 sm:text-sm">
                  Live
                </span>
              </div>

              <div className="relative">
                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                  <h3 className="text-base font-bold text-gray-900/80 sm:text-xl">
                    SILVER
                  </h3>
                  <span className="mt-1 text-[8px] font-medium text-gray-700/80 sm:text-xs">
                    24K | 999
                  </span>
                </div>

                <div className="flex items-end">
                  <span className="text-base font-semibold text-gray-900/60 sm:text-xl">
                    ₹5000.00
                  </span>
                  <span className="mb-0.5 text-[11px] text-gray-700/80 sm:mb-1 sm:text-sm">
                    /gm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Gold Portfolio Card */}
        <div className="gold-card relative mt-6 mb-2 overflow-hidden rounded-2xl p-3">
          {/* Decorative shine */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gray-50/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gray-50/10 blur-2xl" />

          <div className="relative">
            {/* Total Value Section */}
            <div className="mt-2 mb-4 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider text-[#5a4a1a]/60 uppercase">
                  Total Portfolio
                </p>
                <p className="text-2xl font-bold text-[#2d2510]/90 sm:text-3xl">
                  ₹{totalPortfolioValue.toLocaleString()}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text:xs text-[#5a4a1a]/70 sm:text-sm">
                    {totalGoldGrams.toFixed(3)}g gold
                  </span>
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${profitToday >= 0
                      ? "bg-emerald-600/20 text-emerald-800"
                      : "bg-red-600/20 text-red-800"
                      }`}
                  >
                    {profitToday >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {profitToday >= 0 ? "+" : ""}₹
                    {Math.abs(profitToday).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Gold Bar Visual */}
              <div className="relative flex h-20 w-14 flex-col items-center justify-center rounded-lg bg-linear-to-b from-[#f5e6a3] via-[#e8c84a] to-[#c9a432] shadow-lg ring-1 ring-[#b8960c]/30">
                <div className="absolute inset-0.5 rounded-md bg-linear-to-br from-white/40 to-transparent" />
                <span className="relative text-[7px] font-semibold text-[#5a4a1a]/60">
                  FINE GOLD
                </span>
                <span className="relative text-[9px] font-medium text-[#5a4a1a]/50">
                  999.0
                </span>
                <span className="relative mt-0.5 text-sm font-bold text-[#3d3015]">
                  24K
                </span>
                <span className="relative text-[7px] font-semibold text-[#5a4a1a]/60">
                  ZOLD
                </span>
              </div>
            </div>

            {/* Balance Breakdown - Compact */}
            <div className="flex gap-3">
              {/* Digital Gold */}
              <div className="flex-1 rounded-xl bg-[#2d2510]/10 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-[#5a4a1a]/70" />
                  <span className="text-[10px] font-medium text-[#5a4a1a]/70">
                    Gold Bar
                  </span>
                </div>
                <p className="text-sm font-bold text-[#2d2510]">
                  {userGoldGrams.toFixed(3)}g
                </p>
              </div>

              {/* Gold Coins */}
              <div className="flex-1 rounded-xl bg-[#2d2510]/10 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-[#5a4a1a]/70" />
                  <span className="text-[10px] font-medium text-[#5a4a1a]/70">
                    Gold Coins
                  </span>
                </div>
                <p className="text-sm font-bold text-[#2d2510]">
                  {totalCoins} coins
                </p>
              </div>
            </div>

            {/* Coin Pills (if coins exist) */}
            {coinInventory.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {coinInventory.map((coin, idx) => (
                  <span
                    key={idx}
                    className="ml-1 rounded-full bg-[#2d2510]/15 px-2.5 py-1 text-[10px] font-bold text-[#2d2510]"
                  >
                    {coin.coinGrams}g × {coin.quantity}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#fff9e8]/90 px-4 pt-2">
        {/* ================ METAL ACTION BUTTONS ================= */}
        <div>
          <div className="mx-auto mb-8 grid max-w-[1400px] grid-cols-3 gap-4 sm:grid-cols-12 sm:gap-10 lg:grid-cols-6">
            {/* BUY GOLD */}
            <div className="col-span-1 flex flex-col items-center sm:col-span-3 lg:col-span-1">
              <button
                onClick={onBuyGold}
                className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#ead69c]/70 bg-gradient-to-b from-white via-[#faf3d6] to-[#f7eac8] shadow-sm transition hover:shadow-md active:scale-[0.97] sm:h-25"
              >
                <div className="absolute inset-0 bg-gray-50/20 opacity-0 blur-md transition group-hover:opacity-40" />
                <Image
                  src={doubleZoldGold2}
                  alt="zold"
                  className="h-12 w-12 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 sm:h-18 sm:w-18"
                />
              </button>
              <p className="mt-2 text-xs font-bold text-[#1a1a1a]/70 sm:text-sm">
                Buy Gold
              </p>
            </div>

            {/* SELL GOLD */}
            <div className="col-span-1 flex flex-col items-center sm:col-span-3 lg:col-span-1">
              <button
                onClick={onSellGold}
                className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#e4cd8e]/70 bg-gradient-to-b from-white via-[#faf3d6] to-[#f7eac8] shadow-sm transition hover:shadow-md active:scale-[0.97] sm:h-25"
              >
                <div className="absolute inset-0 bg-gray-50/20 opacity-0 blur-md transition group-hover:opacity-40" />
                <Image
                  src={sell_gold}
                  alt="zold"
                  className="h-12 w-12 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 sm:h-15 sm:w-15"
                />
              </button>
              <p className="mt-2 text-xs font-bold text-[#1a1a1a]/70 sm:text-sm">
                Sell Gold
              </p>
            </div>

            {/* BUY COINS */}
            <div className="col-span-1 flex flex-col items-center sm:col-span-6 lg:col-span-2">
              <button
                onClick={() => router.push("buy-coins")}
                className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#ead69c]/70 bg-gradient-to-b from-white via-[#faf3d6] to-[#f7eac8] shadow-sm transition hover:shadow-lg active:scale-[0.98] sm:h-25"
              >
                <Image
                  src={zoldCoin}
                  alt="zold"
                  className="h-12 w-12 rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-110 sm:h-18 sm:w-18"
                />
              </button>
              <p className="mt-2 text-xs font-bold text-[#1a1a1a]/70 sm:text-sm">
                Buy Coins
              </p>
            </div>

            {/* SILVER BLOCK */}
            <div className="col-span-3 sm:col-span-12 md:col-span-12 lg:col-span-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-8">
                {/* BUY SILVER */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={onBuySilver}
                    className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#d6dbe3]/70 bg-gradient-to-b from-white via-[#E1E5EB] to-[#C3CAD4] shadow-sm transition hover:shadow-md active:scale-[0.97] sm:h-25"
                  >
                    <div className="absolute inset-0 bg-gray-50/20 opacity-0 blur-md transition group-hover:opacity-40" />
                    <Image
                      src={doubleZoldSilver}
                      alt="zold"
                      className="h-14 w-14 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 sm:h-18 sm:w-18"
                    />
                  </button>
                  <p className="mt-2 text-xs font-bold text-[#1a1a1a]/70 sm:text-sm">
                    Buy Silver
                  </p>
                </div>

                {/* SELL SILVER */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={onSellSilver}
                    className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#cfd5de]/70 bg-gradient-to-b from-white via-[#d7dde6] to-[#b0b8c6] shadow-sm transition hover:shadow-md active:scale-[0.97] sm:h-25"
                  >
                    <div className="absolute inset-0 bg-gray-50/20 opacity-0 blur-md transition group-hover:opacity-40" />
                    <Image
                      src={sell_silver}
                      alt="zold"
                      className="h-12 w-12 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 sm:h-15 sm:w-15"
                    />
                  </button>
                  <p className="mt-2 text-xs font-bold text-[#1a1a1a]/70 sm:text-sm">
                    Sell Silver
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            QUICK ACTIONS GRID
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-4">
          <h2 className="mb-3 font-semibold text-[#1a1a1a]/70 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                icon: Target,
                label: "Goals",
                onClick: () => setShowGoals(true),
                color: "#8B2942",
              },
              {
                icon: Gift,
                label: "Gift",
                onClick: () => setShowGift(true),
                color: "#D4AF37",
              },
              {
                icon: Users,
                label: "Refer",
                onClick: () => setShowRefer(true),
                color: "#3B82F6",
              },
              {
                icon: ShoppingBag,
                label: "Shop",
                onClick: () => router.push("/jewellery"),
                color: "#8B5CF6",
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.97] dark:bg-[#1a1a1a]"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon
                    className="h-5 w-5"
                    style={{ color: action.color }}
                  />
                </div>
                <span className="text-xs font-medium text-[#1a1a1a]/60 dark:text-white">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PRICE CHART
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10 rounded-2xl bg-gray-50 p-3 shadow-sm dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="m-2 ml-8 hidden h-5 w-5 text-[#D4AF37] sm:block" />
              <span className="text-center text-xs font-semibold text-[#1a1a1a]/90 sm:text-lg dark:text-white">
                Price Chart
              </span>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#f5f5f5] p-1 dark:bg-[#222]">
              {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${chartTimeframe === tf
                    ? "bg-gray-50 text-[#1a1a1a]/70 shadow-sm dark:bg-[#333] dark:text-white"
                    : "text-[#888]/70 hover:text-[#1a1a1a] dark:hover:text-white"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-40" style={{ minHeight: "180px" }}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData[chartTimeframe]}>
                  <defs>
                    <linearGradient
                      id="goldAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    className="dark:stroke-[#333]"
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 50", "dataMax + 50"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString()}`,
                      "Price",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fill="url(#goldAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <BarChart3 className="h-8 w-8 animate-pulse" />
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#f0f0f0] pt-3 dark:border-[#333]">
            <div className="text-center">
              <p className="sm:text:sm text-xs text-[#888] uppercase">High</p>
              <p className="sm:text:sm text-sm font-bold text-[#1a1a1a]/70 dark:text-white">
                ₹6,280
              </p>
            </div>
            <div className="border-x border-[#f0f0f0] text-center dark:border-[#333]">
              <p className="sm:text:sm text-xs text-[#888] uppercase">Low</p>
              <p className="sm:text:sm text-sm font-bold text-[#1a1a1a]/70 dark:text-white">
                ₹6,145
              </p>
            </div>
            <div className="text-center">
              <p className="sm:text:sm text-xs text-[#888] uppercase">Vol</p>
              <p className="sm:text:sm text-sm font-bold text-[#1a1a1a]/70 dark:text-white">
                125 kg
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            AUSPICIOUS DAYS BANNER
            ═══════════════════════════════════════════════════════════════ */}
        <button
          onClick={onOpenAuspiciousDays}
          className="mb-10 w-full overflow-hidden rounded-2xl bg-linear-to-r from-[#8B2942] to-[#6B1D32] p-5 text-left text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Star className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-xs font-medium text-white/80">
                  शुभ मुहूर्त
                </span>
              </div>
              <h3 className="mb-1 text-lg font-bold">Auspicious Days</h3>
              <p className="text-sm text-white/70">Pushya Nakshatra • Jan 13</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/50" />
          </div>
        </button>

        {/* ═══════════════════════════════════════════════════════════════
            GOLD GOALS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1a1a1a]/80 dark:text-white">
              Your Goals
            </h2>
            <button
              onClick={onOpenGoldGoals}
              className="text-xs font-bold text-[#8B2942]/60"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={onOpenGoldGoals}
              className="w-full rounded-2xl bg-gray-50 p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-xl">
                  💍
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1a1a1a]/80 sm:text-sm dark:text-white">
                      Wedding Jewellery
                    </h4>
                    <span className="text-xs font-bold text-[#D4AF37]">
                      25%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f0] dark:bg-[#333]">
                    <div className="h-full w-1/4 rounded-full bg-[#D4AF37]" />
                  </div>
                  <p className="mt-1 text-xs text-[#888]">
                    ₹1.25L / ₹5L • 425 days left
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={onOpenGoldGoals}
              className="w-full rounded-2xl bg-gray-50 p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B2942]/10 text-xl">
                  🪔
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1a1a1a]/80 sm:text-sm dark:text-white">
                      Diwali Gold
                    </h4>
                    <span className="text-xs font-bold text-[#8B2942]/80">
                      45%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f0] dark:bg-[#333]">
                    <div className="h-full w-[45%] rounded-full bg-[#8B2942]" />
                  </div>
                  <p className="mt-1 text-xs text-[#888]">
                    ₹45K / ₹1L • 325 days left
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RECENT TRANSACTIONS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-10 mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1a1a1a]/80 dark:text-white">
              Recent Activity
            </h2>
            <button
              onClick={onOpenWalletDetails}
              className="text-xs font-bold text-[#8B2942]/60"
            >
              See All
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gray-50 shadow-sm dark:bg-[#1a1a1a]">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 3).map((tx, idx) => (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${idx < 2
                    ? "border-b border-[#f0f0f0] dark:border-[#333]"
                    : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === "BUY"
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                        }`}
                    >
                      {tx.type === "BUY" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                        {tx.type === "BUY" ? "Bought" : "Sold"} Gold
                      </p>
                      <p className="text-xs text-[#888]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${tx.type === "BUY" ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {tx.type === "BUY" ? "+" : "-"}
                      {parseFloat(tx.goldGrams).toFixed(3)}g
                    </p>
                    <p className="text-xs text-[#888]">
                      ₹{parseFloat(tx.finalAmount).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-[#ddd] dark:text-[#444]" />
                <p className="text-sm text-[#888]">No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PROMOTIONS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl bg-[#1a1a1a] p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-lg font-bold">Akshaya Tritiya</p>
                <p className="mb-3 text-sm text-white/60">
                  0% making charges up to 10g
                </p>
                <button
                  onClick={onOpenGiftGold}
                  className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#c9a432]"
                >
                  Explore
                </button>
              </div>
              <Sparkles className="h-10 w-10 text-[#D4AF37]/30" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#D4AF37] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-lg font-bold text-[#1a1a1a]">Refer</p>
                <p className="mb-3 text-sm text-[#1a1a1a]/60">
                  Get ₹100 gold for each referral
                </p>
                <button
                  onClick={onOpenReferral}
                  className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#D4AF37] transition-colors hover:bg-[#333]"
                >
                  Refer Now
                </button>
              </div>
              <Users className="h-10 w-10 text-[#1a1a1a]/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Fixed positioning for mobile */}
      {showGift && (
        <div className="fixed bottom-16 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowGift(false)}
          />
          <div className="relative z-[101] h-full w-full overflow-y-auto rounded-none bg-white sm:h-auto sm:max-h-[90vh] sm:w-[90%] sm:max-w-lg sm:rounded-2xl">
            <GiftGold onClose={() => setShowGift(false)} />
          </div>
        </div>
      )}

      {showRefer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowRefer(false)}
          />
          <div className="relative z-[101] h-full w-full overflow-y-auto rounded-none bg-white sm:h-auto sm:max-h-[90vh] sm:w-[90%] sm:max-w-lg sm:rounded-2xl">
            <ReferralProgram onClose={() => setShowRefer(false)} />
          </div>
        </div>
      )}

      {showShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowShop(false)}
          />
          <div className="relative z-[101] h-full w-full overflow-y-auto rounded-none bg-white sm:h-auto sm:max-h-[90vh] sm:w-[90%] sm:max-w-lg sm:rounded-2xl">
            <JewelleryPage onClose={() => setShowShop(false)} />
          </div>
        </div>
      )}

      {showGoals && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowGoals(false)}
          />
          <div className="relative z-[101] h-full w-full overflow-y-auto rounded-none bg-white sm:h-auto sm:max-h-[90vh] sm:w-[90%] sm:max-w-lg sm:rounded-2xl">
            <GoldGoals onClose={() => setShowGoals(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
