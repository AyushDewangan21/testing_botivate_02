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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotificationsPage } from "@/components/NotificationsPage";
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
import BuyGoldImage from "@/components/images/buyGoldImage.png"
import SellGoldImage from "@/components/images/sellGoldImage.jpg"

interface HomeTabProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
  onBuyGold: () => void;
  onSellGold: () => void;
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

  const fetchWalletData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsInternalLoading(false);
        return;
      }

      const results = await Promise.allSettled([
        fetch(`${API_URL}/gold/rates/current`).then(res => res.json()),
        fetch(`${API_URL}/gold/wallet/balance`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${API_URL}/gold/wallet/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
        fetch(`${API_URL}/coins/inventory`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
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
        setUserGoldValue(parseFloat(balanceResult.value.data.currentValue) || 0);
        setRecentTransactions(balanceResult.value.data.recentTransactions || []);
      }

      // Handle Stats
      if (statsResult.status === "fulfilled" && statsResult.value.success) {
        setProfitToday(parseFloat(statsResult.value.data.profitLoss) || 0);
      }

      // Handle Inventory
      if (coinsResult.status === "fulfilled" && coinsResult.value.success && coinsResult.value.data?.inventory) {
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

  useEffect(() => {
    if (showNotifications) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNotifications]);

  // Removed static loading check - components render immediately
  // Only show skeletons for dynamic data sections

  // Calculate total portfolio value
  const totalPortfolioValue = userGoldValue + totalCoinValue;
  const totalGoldGrams =
    userGoldGrams +
    coinInventory.reduce(
      (sum, coin) => sum + coin.coinGrams * coin.quantity,
      0,
    );

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 dark:bg-[#0a0a0a]">
      {/* ═══════════════════════════════════════════════════════════════
          PREMIUM HEADER WITH GOLD CARD
          ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white px-4 pt-4 pb-5 dark:bg-[#111]">
        {/* Top Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/01.jpg"
              alt="ZOLD"
              width={44}
              height={44}
              className="rounded-xl object-cover shadow-sm"
            />
            <div>
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
            onClick={() => setShowNotifications(true)}
            className="relative rounded-full bg-[#f5f5f5] p-2.5 transition-colors hover:bg-[#eee] dark:bg-[#222] dark:hover:bg-[#333]"
          >
            <Bell className="h-5 w-5 text-[#1a1a1a] dark:text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
              3
            </span>
          </button>
        </div>

        {/* ═══════════════════════  LIVE GOLD RATE - Clean Two-Column  ══════════════════════════════════ */}
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#141414]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white">
                Live Gold Rate
              </span>
              <span className="rounded bg-[#D4AF37]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#B8960C]">
                24K • 999.0
              </span>
            </div>
            <span
              className={`flex items-center gap-0.5 text-xs font-semibold ${priceChange >= 0 ? "text-emerald-600" : "text-red-500"}`}
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
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl bg-emerald-100 border-2 border-emerald-500/30 p-3 shadow-[0_6px_18px_rgba(20,184,166,0.25)]">
              <p className="mb-0.5 text-[10px] font-medium text-emerald-900 uppercase">
                Buy </p>
              {isInternalLoading ?
                (<div className="h-7 w-24 animate-pulse rounded bg-emerald-200/50" />)
                : (<p className="text-lg font-bold text-emerald-900"> ₹{goldBuyPrice.toFixed(2)}
                  <span className="text-xs font-normal opacity-60">/g</span> </p>)}
            </div>
            <div className="rounded-xl bg-rose-100 border-2 border-rose-300/90 p-3 shadow-[0_6px_18px_rgba(244,63,94,0.25)]">
              <p className="mb-0.5 text-[10px] font-medium text-rose-800 uppercase"> Sell </p>
              {isInternalLoading ? (<div className="h-7 w-24 animate-pulse rounded bg-rose-200/50" />)
                : (<p className="text-lg font-bold text-red-900"> ₹{goldSellPrice.toFixed(2)}
                  <span className="text-xs font-normal opacity-60">/g</span> </p>)}
            </div>
          </div>
        </div>

        {/* Premium Gold Portfolio Card */}
        <div className="gold-card relative overflow-hidden rounded-2xl p-5">
          {/* Decorative shine */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            {/* Total Value Section */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider text-[#5a4a1a]/60 uppercase">
                  Total Portfolio
                </p>
                <p className="text-3xl font-bold text-[#2d2510]">
                  ₹{totalPortfolioValue.toLocaleString()}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm text-[#5a4a1a]/70">
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
                    Digital Gold
                  </span>
                </div>
                <p className="text-base font-bold text-[#2d2510]">
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
                <p className="text-base font-bold text-[#2d2510]">
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
                    className="rounded-full bg-[#2d2510]/15 px-2.5 py-1 text-[10px] font-semibold text-[#2d2510]"
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
      <div className="px-4 pt-4">
        {/* ═══════════════════════════════════════════════════════════════
            BUY & SELL ACTIONS - Professional Design
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-4 flex gap-2 sm:gap-10 mt-4 px-1">


          {/* Buy Gold */}
          <div className="flex-1">
            <button onClick={onBuyGold} className="sm:hidden w-full">
              <Image
                src={BuyGoldImage}
                alt="gold"
                className="min-h-20 mb-2 w-full h-20 max-w-[90px] mx-auto object-contain rounded-xl shadow-sm transition-all hover:shadow-md active:scale-[0.97] bg-black border-1 border-yellow-500"
              />
              <div className="text-center mt-1">
                <p className="text-xs font-bold  text-[#1a1a1a]">Buy Gold</p>
                <p className="text-[10px] text-gray-500">Digital gold</p>
              </div>
            </button>

            {/* Desktop unchanged */}
            <button
              onClick={onBuyGold}
              className="hidden sm:flex group relative w-full overflow-hidden rounded-2xl bg-[#1a1a1a] p-4 items-center gap-3"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#D4AF37]">
                <ArrowUpRight className="h-5 w-5 text-[#1a1a1a]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Buy Gold</p>
                <p className="text-xs text-white/50">Digital gold</p>
              </div>
            </button>
          </div>


          {/* Sell Gold */}
          <div className="flex-1">
            <button onClick={onSellGold} className="sm:hidden w-full">
              <div className="w-full h-20 max-w-[90px] mx-auto rounded-xl overflow-hidden shadow-sm hover:shadow-md bg-white">
                <div className="flex justify-center items-center w-full">
                  <Image
                    src={SellGoldImage}
                    alt="gold"
                    className="w-16 h-16 object-contain transition-transform duration-300 mt-2"
                  />
                </div>

              </div>

              <div className="text-center mt-1">
                <p className="text-xs font-bold text-[#1a1a1a]">Sell Gold</p>
                <p className="text-[10px] text-gray-500">Withdraw</p>
              </div>
            </button>

            {/* Desktop unchanged */}
            <button
              onClick={onSellGold}
              className="hidden sm:flex group relative w-full overflow-hidden rounded-2xl border-2 border-[#e8e8e8] bg-white p-4 items-center gap-3"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#f5f5f5]">
                <TrendingDown className="h-5 w-5 text-[#666]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1a1a1a]">Sell Gold</p>
                <p className="text-xs text-[#888]">Withdraw</p>
              </div>
            </button>
          </div>


          {/* Buy Coins */}
          <div className="flex-1">
            <button onClick={() => router.push("/buy-coins")} className="sm:hidden w-full">
              <Image
                src={zoldImage}
                alt="coins"
                className=" mb-2  w-full h-20 max-w-[90px] mx-auto object-contain rounded-xl  bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.97]"
              />
              <div className="text-center mt-1">
                <p className="text-xs font-bold text-[#1a1a1a]">Buy Coins</p>
                <p className="text-[10px] text-gray-500">Gold coins</p>
              </div>
            </button>

            {/* Desktop unchanged */}
            <button
              onClick={() => router.push("/buy-coins")}
              className="hidden sm:flex group relative w-full overflow-hidden rounded-2xl border-2 border-[#D4AF37]/40 bg-white p-4 items-center gap-3"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <Coins className="h-5 w-5 text-[#B8960C]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1a1a1a]">Buy Coins</p>
                <p className="text-xs text-[#888]">Gold coins</p>
              </div>
            </button>
          </div>

        </div>









        {/* ═══════════════════════════════════════════════════════════════
            BUY GOLD COINS - Premium Section
            ═══════════════════════════════════════════════════════════════ */}

        {/* <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-[#141414]">
         
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#f5e6a3] to-[#d4af37]">
                <Coins className="h-4 w-4 text-[#5a4a1a]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] dark:text-white">
                  Buy Gold Coins
                </h3>
                <p className="text-[10px] text-[#888]">
                  24K Pure • 999.0 Fineness
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              Free Delivery
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { weight: 1, price: goldBuyPrice * 1 },
              { weight: 2, price: goldBuyPrice * 2 },
              { weight: 5, price: goldBuyPrice * 5 },
              { weight: 10, price: goldBuyPrice * 10 },
            ].map((coin) => (
              <button
                key={coin.weight}
                onClick={() => router.push("/buy-coins")}
                className="group relative flex flex-col items-center rounded-xl border-2 border-[#f0f0f0] bg-[#fafafa] p-3 transition-all hover:border-[#D4AF37] hover:bg-white hover:shadow-md active:scale-[0.97] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-[#D4AF37] dark:hover:bg-[#222]"
              >
               
                <div className="relative mb-2 flex h-12 w-12 items-center justify-center">
               
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#f5e6a3] via-[#e8c84a] to-[#c9a432] shadow-md ring-2 ring-[#b8960c]/20" />
                  <div className="absolute inset-1 rounded-full bg-linear-to-br from-white/30 to-transparent" />
              
                  <div className="relative flex flex-col items-center">
                    <span className="text-lg font-bold text-[#3d3015]">
                      {coin.weight}
                    </span>
                    <span className="text-[8px] font-semibold text-[#5a4a1a]/70">
                      GM
                    </span>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-[#1a1a1a] dark:text-white">
                  ₹{Math.round(coin.price).toLocaleString()}
                </p>

            
                <div className="mt-1.5 h-0.5 w-4 rounded-full bg-[#e0e0e0] transition-all group-hover:w-6 group-hover:bg-[#D4AF37] dark:bg-[#333]" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-3 dark:border-[#2a2a2a]">
            <button
              onClick={() => router.push("/buy-coins")}
              className="flex items-center gap-1 text-xs font-semibold text-[#B8960C] transition-colors hover:text-[#96780a]"
            >
              <span>View all coins</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => router.push("/buy-coins")}
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#1a1a1a] transition-all hover:bg-[#c9a432] active:scale-[0.97]"
            >
              Buy Coins
            </button>
          </div>
        </div> */}


        {/* ═══════════════════════════════════════════════════════════════
            QUICK ACTIONS GRID
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-4">
          <h2 className="mb-3 font-semibold text-[#1a1a1a] dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-3">
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
                className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.97] dark:bg-[#1a1a1a]"
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
                <span className="text-xs font-medium text-[#1a1a1a] dark:text-white">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* ═══════════════════════════════════════════════════════════════
            PRICE CHART
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-[#1a1a1a]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#D4AF37]" />
              <span className="font-semibold text-[#1a1a1a] dark:text-white">
                Price Chart
              </span>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#f5f5f5] p-1 dark:bg-[#222]">
              {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${chartTimeframe === tf
                    ? "bg-white text-[#1a1a1a] shadow-sm dark:bg-[#333] dark:text-white"
                    : "text-[#888] hover:text-[#1a1a1a] dark:hover:text-white"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-40" style={{ minHeight: '160px' }}>
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
              <p className="text-[10px] text-[#888] uppercase">High</p>
              <p className="font-semibold text-[#1a1a1a] dark:text-white">
                ₹6,280
              </p>
            </div>
            <div className="border-x border-[#f0f0f0] text-center dark:border-[#333]">
              <p className="text-[10px] text-[#888] uppercase">Low</p>
              <p className="font-semibold text-[#1a1a1a] dark:text-white">
                ₹6,145
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#888] uppercase">Vol</p>
              <p className="font-semibold text-[#1a1a1a] dark:text-white">
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
          className="mb-4 w-full overflow-hidden rounded-2xl bg-linear-to-r from-[#8B2942] to-[#6B1D32] p-5 text-left text-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
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
            <h2 className="font-semibold text-[#1a1a1a] dark:text-white">
              Your Goals
            </h2>
            <button
              onClick={onOpenGoldGoals}
              className="text-sm font-medium text-[#8B2942]"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={onOpenGoldGoals}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-xl">
                  💍
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1a1a1a] dark:text-white">
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
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B2942]/10 text-xl">
                  🪔
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1a1a1a] dark:text-white">
                      Diwali Gold
                    </h4>
                    <span className="text-xs font-bold text-[#8B2942]">
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
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-[#1a1a1a] dark:text-white">
              Recent Activity
            </h2>
            <button
              onClick={onOpenWalletDetails}
              className="text-sm font-medium text-[#8B2942]"
            >
              See All
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#1a1a1a]">
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

      {/* Notifications Modal */}
      {showGift && <GiftGold onClose={() => setShowGift(false)} />}
      {showRefer && <ReferralProgram onClose={() => setShowRefer(false)} />}
      {showShop && <JewelleryPage onClose={() => setShowShop(false)} />}
      {showGoals && <GoldGoals onClose={() => setShowGoals(false)} />}

    </div>
  );
} 