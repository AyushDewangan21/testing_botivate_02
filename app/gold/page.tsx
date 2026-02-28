"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Search,
  SlidersHorizontal,
  CheckCircle,
  CreditCard,
  Heart,
  Award,
  BadgeCheck,
  Wallet,
  Info,
  Package,
  Sparkles,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Minus,
  Plus,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

// Images formate of JPG  -> Not optimized loading
// import img1 from "@/components/images/1gmZold.jpg";
// import img2 from "@/components/images/2gmZold.jpg";
// import img5 from "@/components/images/5gmZold.jpg";
// import img10 from "@/components/images/10gmZold.jpg";
// import img1Box from "@/components/images/1gmZoldBox.jpg";
// import img2Box from "@/components/images/2gmZoldBox.jpg";
// import img5Box from "@/components/images/5gmZoldBox.jpg";
// import img10Box from "@/components/images/10gmZoldBox.jpg";

// Images of Formate WEBP --> Optimized  loading
import img1 from "@/components/images/1gmZold.webp";
import img2 from "@/components/images/2gmZold.webp";
import img5 from "@/components/images/5gmZold.webp";
import img10 from "@/components/images/10gmZold.webp";
import img1Box from "@/components/images/1gmZoldBox.webp";
import img2Box from "@/components/images/2gmZoldBox.webp";
import img5Box from "@/components/images/5gmZoldBox.webp";
import img10Box from "@/components/images/10gmZoldBox.webp";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";


interface CartItem {
  weight: number;
  quantity: number;
  price: number;
}

// interface CoinProduct {  
//   weight: number;
//   label: string;
//   popular: boolean;
//   displayName: string;
//   description: string;
// }

// const coinImages: Record<number, any> = {
//   1: img1,
//   2: img2,
//   5: img5,
//   10: img10,
// };

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CoinProduct {
  weight: number;
  label?: string;
  popular?: boolean;
  displayName: string;
  description: string;
}

interface CartItem {
  weight: number;
  quantity: number;
  price: number;
}

const coinImages: Record<number, any> = {
  1: img1,
  2: img2,
  5: img5,
  10: img10,
};

const coinBoxImages: Record<number, any> = {
  1: img1Box,
  2: img2Box,
  5: img5Box,
  10: img10Box,
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#141414]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8960C] border-t-transparent"></div>
        </div>
      }
    >
      <GoldContent />
    </Suspense>
  );
}

function GoldContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinProduct | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [goldBuyPrice, setGoldBuyPrice] = useState(6245.5);
  const [selectedPayment, setSelectedPayment] = useState<
    "rupees" | "wallet_gold"
  >("rupees");
  const [testWalletBalance, setTestWalletBalance] = useState(0);
  const [userGoldBalance, setUserGoldBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBox, setShowBox] = useState(false);

  const gstRate = 3;
  const makingCharges = 0;

  const categories = ["All", "Coins", "Bars", "24K", "1g", "2g", "5g", "10g"];

  const coinProducts: CoinProduct[] = [
    {
      weight: 1,
      label: "1 Gram",
      popular: true,
      displayName: "ZG 1 Gram Gold Mint Bar 24k (99.9%)",
      description:
        "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 1 gram. The best-in-class quality and guaranteed purity of 99.9% gold are of a certified accuracy, the caliber you can never doubt. We offer quality products at the best-assured prices.",
    },
    {
      weight: 2,
      label: "2 Grams",
      popular: false,
      displayName: "ZG 2 Gram Gold Mint Bar 24k (99.9%)",
      description:
        "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 2 grams. The best-in-class quality and guaranteed purity of 99.9% gold are of a certified accuracy, the caliber you can never doubt. We offer quality products at the best-assured prices.",
    },
    {
      weight: 5,
      label: "5 Grams",
      popular: false,
      displayName: "ZG 5 Gram Gold Mint Bar 24k (99.9%)",
      description:
        "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 5 grams. The best-in-class quality and guaranteed purity of 99.9% gold are of a certified accuracy, the caliber you can never doubt. We offer quality products at the best-assured prices.",
    },
    {
      weight: 10,
      label: "10 Grams",
      popular: false,
      displayName: "ZG 10 Gram Gold Mint Bar 24k (99.9%)",
      description:
        "This ZOLD GOLD 24 Karat gold mint bar with a high-polished finish weighs 10 grams. The best-in-class quality and guaranteed purity of 99.9% gold are of a certified accuracy, the caliber you can never doubt. We offer quality products at the best-assured prices.",
    },
  ];

  const coin = coinProducts.find((c) => c.weight === id);
  useEffect(() => {
    if (!coin) return;

    const preloadImages = [coinImages[coin.weight], coinBoxImages[coin.weight]];

    preloadImages.forEach((img) => {
      const image = new window.Image();
      image.src = img.src;
    });
  }, [coin]);

  // ---------------------- AUTH & FETCH ----------------------

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchTestWallet = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/gold/test-wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success)
        setTestWalletBalance(parseFloat(data.data.virtualBalance));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGoldBalance = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/gold/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success)
        setUserGoldBalance(parseFloat(data.data.goldBalance) || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGoldRate = async () => {
    try {
      const res = await fetch(`${API_URL}/gold/rates/current`);
      const data = await res.json();
      if (data.success) setGoldBuyPrice(parseFloat(data.data.buyRate));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestWallet();
    fetchGoldBalance();
    fetchGoldRate();

    const socket: Socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5001",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
      },
    );

    socket.on(
      "goldPriceUpdate",
      (data: { buyRate: number; sellRate: number }) => {
        setGoldBuyPrice(data.buyRate);
      },
    );
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Cleanup function to disconnect on unmount
    return () => {
      socket.disconnect();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // ---------------------- CART LOGIC ----------------------
  const addToCart = (coin: CoinProduct, qty: number = 1) => {
    const existing = cart.find((c) => c.weight === coin.weight);
    const price = coin.weight * goldBuyPrice;
    if (existing) {
      setCart(
        cart.map((c) =>
          c.weight === coin.weight ? { ...c, quantity: c.quantity + qty } : c,
        ),
      );
    } else {
      setCart([...cart, { weight: coin.weight, quantity: qty, price }]);
    }
  };

  const updateQuantity = (weight: number, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.weight === weight
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (weight: number) =>
    setCart(cart.filter((c) => c.weight !== weight));
  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const toggleWishlist = (weight: number) => {
    setWishlist((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight],
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartGst = cartTotal * (gstRate / 100);
  const cartFinalTotal = cartTotal + cartGst + makingCharges;
  const totalCoins = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartWeight = cart.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0,
  );

  const canAffordCoins = () => {
    if (selectedPayment === "wallet_gold")
      return userGoldBalance >= totalCartWeight;
    return testWalletBalance >= cartFinalTotal;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const token = getAuthToken();
      if (selectedPayment === "wallet_gold") {
        for (const item of cart) {
          const res = await fetch(`${API_URL}/coins/convert`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coinGrams: item.weight,
              quantity: item.quantity,
            }),
          });
          const data = await res.json();
          if (!data.success)
            throw new Error(data.message || "Failed to convert");
        }
        await fetchGoldBalance();
      } else {
        for (const item of cart) {
          const res = await fetch(`${API_URL}/coins/buy`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coinGrams: item.weight,
              quantity: item.quantity,
            }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || "Failed to buy");
        }
        await fetchTestWallet();
      }
      setPurchaseSuccess(true);
      setCart([]);
      setSelectedCoin(null);
      setIsCartOpen(false);
    } catch (err: any) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!coin) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold">
        Coin not found
      </div>
    );
  }

  return (
    <>
      {/* <Header /> */}
      {/* HEADER */}
      {/* Header Row - Search + Icons */}
      <div className="sticky top-0 z-40 bg-gray-50 px-4 py-3 shadow-sm dark:bg-[#141414]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:bg-[#F6F6F6] active:scale-95 dark:hover:bg-[#1a1a1a]"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gold coins..."
              className="h-12 w-full rounded-full border border-[#EAEAEA] bg-[#F6F6F6] py-3 pr-4 pl-12 text-sm text-[#1a1a1a] placeholder-gray-400 transition-all focus:border-[#B8960C] focus:bg-gray-50 focus:shadow-md focus:outline-none dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#D4AF37]"
            />
            <Search className="absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Filter Button */}
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6F6F6] transition-all hover:bg-[#ECECEC] active:scale-95 dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a]">
            <SlidersHorizontal className="h-[18px] w-[18px] text-gray-700 dark:text-gray-300" />
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6F6F6] transition-all hover:bg-[#ECECEC] active:scale-95 dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a]"
          >
            <ShoppingCart className="h-[18px] w-[18px] text-gray-700 dark:text-gray-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#F5C542] px-1 text-[11px] leading-none font-bold text-[#1a1a1a]">
                {totalCoins}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <div className="min-h-screen bg-[#f8f7f3] px-6 py-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 rounded-md md:grid-cols-2">
          {/* IMAGE */}
          <div className="relative rounded-full transition-all duration-200 hover:shadow-xl">
            {/* Left Arrow (visible only when box is shown) */}
            {showBox && (
              <button
                onClick={() => setShowBox(false)}
                className="group absolute top-1/2 left-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#B8960C] bg-gray-50 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#B8960C]"
              >
                <ChevronLeft className="h-6 w-6 text-[#B8960C] transition-colors duration-300 group-hover:text-white" />
              </button>
            )}

            {/* Right Arrow (visible only when coin is shown) */}
            {!showBox && (
              <button
                onClick={() => setShowBox(true)}
                className="group absolute top-1/2 right-3 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#B8960C] bg-gray-50 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#B8960C]"
              >
                <ChevronRight className="h-6 w-6 text-[#B8960C] transition-colors duration-300 group-hover:text-white" />
              </button>
            )}

            <div className="group relative h-[460px] w-full overflow-hidden rounded-[40px] border bg-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
              <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-tr from-white/25 via-transparent to-transparent" />

              <Image
                key={showBox ? "box" : "coin"}
                src={
                  showBox ? coinBoxImages[coin.weight] : coinImages[coin.weight]
                }
                alt={coin.displayName}
                fill
                priority
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-500"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="rounded-[28px] bg-gray-50 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-xl">
            <h1 className="mb-4 text-3xl font-bold text-[#1a1a1a]">
              {coin.displayName}
            </h1>
            <p className="mb-6 leading-relaxed text-gray-600">
              {coin.description}
            </p>
            <div className="mb-8 flex items-center gap-4">
              <span className="rounded-full bg-[#F5C542]/20 px-5 py-2 text-sm font-bold text-[#B8960C]">
                {coin.weight} Gram
              </span>
              <span className="text-lg font-semibold text-[#B8960C]">
                24K • 99.9% Pure
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(coin);
                }}
                className="rounded-full border-2 border-[#B8960C] bg-gray-50 px-8 py-3 text-sm font-bold text-[#B8960C] transition-all hover:bg-[#B8960C] hover:text-white"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => {
                  addToCart(coin);
                  setIsCartOpen(true);
                }}
                className="rounded-full border-2 border-[#B8960C] bg-[#B8960C] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#D4AF37]"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Drawer - Improved Design */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:items-center sm:justify-center sm:px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-t-[28px] bg-gray-50 shadow-2xl sm:rounded-[28px] dark:bg-[#141414]">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-[#ECECEC] px-6 py-5 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5C542]">
                  <ShoppingCart className="h-5 w-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1a1a1a] dark:text-white">
                    Shopping Cart
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-[#888]">
                    {totalCoins} item{totalCoins > 1 ? "s" : ""} •{" "}
                    {totalCartWeight}g
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-[#F6F6F6] active:scale-95 dark:hover:bg-[#1a1a1a]"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="max-h-[400px] overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F6] dark:bg-[#1a1a1a]">
                    <ShoppingCart className="h-8 w-8 text-gray-300 dark:text-[#333]" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-[#888]">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-[#666]">
                    Add some gold coins to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const coinProduct = coinProducts.find(
                      (c) => c.weight === item.weight,
                    );
                    const itemPrice = item.price * item.quantity;
                    const itemGst = itemPrice * (gstRate / 100);
                    const itemTotal = itemPrice + itemGst;

                    return (
                      <div
                        key={item.weight}
                        className="flex items-center gap-4 rounded-[18px] border border-[#ECECEC] bg-gray-50 p-4 transition-all hover:shadow-md dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
                      >
                        {/* Coin Icon */}
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-linear-to-br from-[#f5e6a3] via-[#e8c84a] to-[#c9a432] shadow-md">
                          <div className="absolute inset-0 opacity-10">
                            <svg
                              className="h-full w-full"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <pattern
                                id={`cart-pattern-${item.weight}`}
                                x="0"
                                y="0"
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                              >
                                <circle
                                  cx="10"
                                  cy="10"
                                  r="8"
                                  fill="none"
                                  stroke="#3d3015"
                                  strokeWidth="1"
                                  opacity="0.3"
                                />
                              </pattern>
                              <rect
                                width="100%"
                                height="100%"
                                fill={`url(#cart-pattern-${item.weight})`}
                              />
                            </svg>
                          </div>
                          <div className="relative text-center">
                            <span className="block text-base font-bold text-[#3d3015]">
                              {item.weight}
                            </span>
                            <span className="text-[9px] font-semibold text-[#5a4a1a]/70">
                              GM
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/30 to-transparent" />
                        </div>

                        {/* Item Info */}
                        <div className="flex-1">
                          <p className="mb-1.5 line-clamp-1 text-[13px] font-semibold text-[#1a1a1a] dark:text-white">
                            {coinProduct?.label} Gold Coin
                          </p>
                          <p className="mb-0.5 text-base font-bold text-[#B8960C] dark:text-[#D4AF37]">
                            ₹{Math.round(itemTotal).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-[#888]">
                            {item.quantity} × ₹
                            {Math.round(item.price).toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.weight, -1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#B8960C] bg-gray-50 transition-all hover:bg-[#B8960C] hover:text-white active:scale-90 dark:border-[#D4AF37] dark:bg-[#0a0a0a] dark:hover:bg-[#D4AF37]"
                          >
                            <Minus className="h-4 w-4 text-[#B8960C] dark:text-[#D4AF37]" />
                          </button>
                          <span className="min-w-[28px] text-center text-base font-bold text-[#1a1a1a] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.weight, 1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B8960C] text-white transition-all hover:scale-110 hover:bg-[#96780a] active:scale-90 dark:bg-[#D4AF37] dark:text-[#1a1a1a] dark:hover:bg-[#c9a432]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item.weight);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-red-50 active:scale-90 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <>
                {/* Payment Method Selection */}
                <div className="border-t border-[#ECECEC] bg-[#FAFAFA] px-6 py-5 dark:border-[#2a2a2a] dark:bg-[#0a0a0a]">
                  <h3 className="mb-3 text-sm font-bold text-[#1a1a1a] dark:text-white">
                    Select Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedPayment("rupees")}
                      className={`group rounded-[16px] border-2 p-4 text-left transition-all active:scale-95 ${selectedPayment === "rupees"
                        ? "border-[#B8960C] bg-gradient-to-br from-[#fffef5] to-[#fef9e6] shadow-lg shadow-[#B8960C]/20 dark:border-[#D4AF37] dark:from-[#D4AF37]/15 dark:to-[#D4AF37]/5"
                        : "border-[#E6E6E6] bg-gray-50 hover:border-[#B8960C] hover:shadow-md dark:border-[#2a2a2a] dark:bg-[#141414] dark:hover:border-[#D4AF37]"
                        }`}
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-all ${selectedPayment === "rupees"
                          ? "bg-[#B8960C] dark:bg-[#D4AF37]"
                          : "bg-[#F6F6F6] group-hover:bg-[#B8960C]/10 dark:bg-[#1a1a1a]"
                          }`}
                      >
                        <CreditCard
                          className={`h-5 w-5 ${selectedPayment === "rupees"
                            ? "text-white dark:text-[#1a1a1a]"
                            : "text-gray-600 dark:text-gray-400"
                            }`}
                        />
                      </div>
                      <p className="mb-1 text-sm font-bold text-[#1a1a1a] dark:text-white">
                        Rupees
                      </p>
                      <p className="text-xs text-gray-600 dark:text-[#888]">
                        ₹
                        {testWalletBalance.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      {selectedPayment === "rupees" && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-5 w-5 fill-[#B8960C] text-white dark:fill-[#D4AF37]" />
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPayment("wallet_gold")}
                      className={`group rounded-[16px] border-2 p-4 text-left transition-all active:scale-95 ${selectedPayment === "wallet_gold"
                        ? "border-[#B8960C] bg-gradient-to-br from-[#fffef5] to-[#fef9e6] shadow-lg shadow-[#B8960C]/20 dark:border-[#D4AF37] dark:from-[#D4AF37]/15 dark:to-[#D4AF37]/5"
                        : "border-[#E6E6E6] bg-gray-50 hover:border-[#B8960C] hover:shadow-md dark:border-[#2a2a2a] dark:bg-[#141414] dark:hover:border-[#D4AF37]"
                        }`}
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-all ${selectedPayment === "wallet_gold"
                          ? "bg-[#B8960C] dark:bg-[#D4AF37]"
                          : "bg-[#F6F6F6] group-hover:bg-[#B8960C]/10 dark:bg-[#1a1a1a]"
                          }`}
                      >
                        <Wallet
                          className={`h-5 w-5 ${selectedPayment === "wallet_gold"
                            ? "text-white dark:text-[#1a1a1a]"
                            : "text-gray-600 dark:text-gray-400"
                            }`}
                        />
                      </div>
                      <p className="mb-1 text-sm font-bold text-[#1a1a1a] dark:text-white">
                        Wallet Gold
                      </p>
                      <p className="text-xs text-gray-600 dark:text-[#888]">
                        {userGoldBalance.toFixed(4)}g
                      </p>
                      {selectedPayment === "wallet_gold" && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-5 w-5 fill-[#B8960C] text-white dark:fill-[#D4AF37]" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-[#ECECEC] px-6 py-5 dark:border-[#2a2a2a]">
                  <div className="mb-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-[#888]">
                        Subtotal ({totalCoins} coins, {totalCartWeight}g)
                      </span>
                      <span className="font-semibold text-[#1a1a1a] dark:text-white">
                        ₹{Math.round(cartTotal).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-[#888]">
                        GST ({gstRate}%)
                      </span>
                      <span className="font-semibold text-[#1a1a1a] dark:text-white">
                        ₹{Math.round(cartGst).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-[#888]">
                        Making Charges
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between rounded-[12px] bg-gradient-to-r from-[#fffef5] to-[#fef9e6] p-3 dark:from-[#D4AF37]/10 dark:to-[#D4AF37]/5">
                      <span className="font-bold text-[#1a1a1a] dark:text-white">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-[#B8960C] dark:text-[#D4AF37]">
                        ₹{Math.round(cartFinalTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!canAffordCoins() && (
                    <div className="mb-4 flex items-start gap-2 rounded-[14px] bg-red-50 p-3 dark:bg-red-900/20">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                      <p className="text-xs leading-relaxed text-red-600 dark:text-red-400">
                        {selectedPayment === "wallet_gold"
                          ? `Insufficient gold balance. Need ${(totalCartWeight - userGoldBalance).toFixed(4)}g more in your wallet.`
                          : `Insufficient balance. Need ₹${(cartFinalTotal - testWalletBalance).toFixed(2)} more in your test wallet.`}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={clearCart}
                      className="rounded-full border-2 border-[#E6E6E6] bg-gray-50 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-[0.97] dark:border-[#2a2a2a] dark:bg-[#0a0a0a] dark:text-gray-300 dark:hover:border-red-500/50 dark:hover:bg-red-900/20"
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={loading || !canAffordCoins()}
                      className="rounded-full bg-linear-to-r from-[#9c2c3c] to-[#c13a4a] py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.97] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:shadow-none dark:disabled:from-[#2a2a2a] dark:disabled:to-[#2a2a2a] dark:disabled:text-[#555]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        "PROCEED TO CHECKOUT"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
