"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Heart,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/components/store/cartSlice";
import { RootState } from "@/components/store/store";

import LumenHeader from "../LumenHeader";
import AnimatedBackground from "../AnimatedBackground";
import CartDrawer from "../CartDrawer";

import img1 from "../images/1gmZold.webp";
import img2 from "../images/2gmZold.webp";
import img5 from "../images/5gmZold.webp";
import img10 from "../images/10gmZold.webp";

// Silver images (you'll need to add these)
import silverImg1 from "../images/silver-Zold-Bar.png";
import silverImg2 from "../images/silver-Zold-Bar.png";
import silverImg5 from "../images/silver-Zold-Bar.png";
import silverImg10 from "../images/silver-Zold-Bar.png";

const goldImages: Record<number, any> = {
  1: img1,
  2: img2,
  5: img5,
  10: img10,
};

const silverImages: Record<number, any> = {
  1: silverImg1,
  2: silverImg2,
  5: silverImg5,
  10: silverImg10,
};

interface CoinProduct {
  weight: number;
  label: string;
  popular: boolean;
  displayName: string;
  description: string;
}

export default function BuyCoinsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Metal state
  const [metal, setMetal] = useState<"gold" | "silver">("gold");

  // Use Redux for cart
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Local state for non-cart logic
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [goldBuyPrice, setGoldBuyPrice] = useState(6245.5);
  const [silverBuyPrice, setSilverBuyPrice] = useState(89.5);

  // Dynamic values based on metal
  const isGold = metal === "gold";
  const currentPrice = isGold ? goldBuyPrice : silverBuyPrice;
  const currentImages = isGold ? goldImages : silverImages;
  const accentColor = isGold ? "#B8960C" : " #374151";
  const metalName = isGold ? "Gold" : "Silver";
  const purity = isGold ? "24K" : "999 Fine";
  const headerGradient = isGold
    ? "from-[#f6e8bd] to-[#f1dda5]"
    : "from-[#d7dde6] to-[#b0b8c6]";

  const coinProducts: CoinProduct[] = [
    {
      weight: 1,
      label: "1 Gram",
      popular: true,
      displayName: `ZG 1 Gram ${metalName} Mint Bar ${isGold ? "24k (99.9%)" : "999 Fine Silver"}`,
      description: `This ZOLD ${metalName} ${isGold ? "24 Karat gold" : "999 Fine Silver"} mint bar with a high-polished finish weighs 1 gram. The best-in-class quality.`,
    },
    {
      weight: 2,
      label: "2 Grams",
      popular: false,
      displayName: `ZG 2 Gram ${metalName} Mint Bar ${isGold ? "24k (99.9%)" : "999 Fine Silver"}`,
      description: `This ZOLD ${metalName} ${isGold ? "24 Karat gold" : "999 Fine Silver"} mint bar with a high-polished finish weighs 2 grams. The best-in-class quality.`,
    },
    {
      weight: 5,
      label: "5 Grams",
      popular: false,
      displayName: `ZG 5 Gram ${metalName} Mint Bar ${isGold ? "24k (99.9%)" : "999 Fine Silver"}`,
      description: `This ZOLD ${metalName} ${isGold ? "24 Karat gold" : "999 Fine Silver"} mint bar with a high-polished finish weighs 5 grams. The best-in-class quality.`,
    },
    {
      weight: 10,
      label: "10 Grams",
      popular: false,
      displayName: `ZG 10 Gram ${metalName} Mint Bar ${isGold ? "24k (99.9%)" : "999 Fine Silver"}`,
      description: `This ZOLD ${metalName} ${isGold ? "24 Karat gold" : "999 Fine Silver"} mint bar with a high-polished finish weighs 10 grams. The best-in-class quality.`,
    },
  ];

  /* ------------------------------------------------------------
     Helpers
  ------------------------------------------------------------ */
  const toggleWishlist = (w: number) => {
    setWishlist((prev) =>
      prev.includes(w) ? prev.filter((i) => i !== w) : [...prev, w]
    );
  };

  const getItemQuantity = (w: number) => {
    return cartItems.find((i) => i.weight === w)?.quantity || 0;
  };

  const getItemInCart = (w: number) => {
    return cartItems.some((i) => i.weight === w);
  };

  const handleAddToCart = (coin: CoinProduct, qty: number) => {
    dispatch(
      addToCart({
        weight: coin.weight,
        quantity: qty,
        price: coin.weight * currentPrice,
        displayName: coin.displayName,
        // metal: metal, // Add metal type to cart item
      })
    );
  };

  const handleUpdateQuantity = (w: number, q: number) => {
    dispatch(updateQuantity({ weight: w, quantity: q }));
  };

  // Global styles as Tailwind classes
  const globalStyles = `
    html, body {
      overflow: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <>
      {/* Global scrollbar hiding styles */}
      <style jsx global>{globalStyles}</style>

      {/* Shared Components */}
      <LumenHeader />
      <CartDrawer />

      <div className={`relative font-normal bg-gradient-to-br from-[#fdfcf5] to-white overflow-x-hidden pt-15 sm:pt-20  min-h-screen overflow-hidden`}>
        <AnimatedBackground />

        {/* Metal Selection Tabs */}
        <div className={`sticky z-20 bg-gradient-to-r ${headerGradient} py-2 px-4 shadow-sm`}>
          <div className="max-w-[200px] mx-auto flex items-center justify-center gap-16 sm:gap-40 sm:gap-12">
            {/* GOLD */}
            <button
              onClick={() => setMetal("gold")}
              className={`relative px-1 py-1 text-sm sm:text-base font-bold tracking-wide transition-all ${metal === "gold"
                ? "text-[#1a1a2e]"
                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                }`}
            >
              GOLD
              {metal === "gold" && (
                <motion.div
                  layoutId="metalUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#1a1a2e] rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>

            {/* SILVER */}
            <button
              onClick={() => setMetal("silver")}
              className={`relative px-1 py-1 text-sm sm:text-base font-bold tracking-wide transition-all ${metal === "silver"
                ? "text-[#1a1a2e]"
                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                }`}
            >
              SILVER
              {metal === "silver" && (
                <motion.div
                  layoutId="metalUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#1a1a2e] rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>

        </div>

        {/* Banner Text */}
        <div className="relative z-10 px-5 pb-0 pt-4 text-center">
          <h2 className="sm:text-2xl text-normal font-extrabold mb-2.5 tracking-tight" style={{ color: accentColor }}>
            Purchase {metalName} Coins
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-[600px] mx-auto pb-4">
            Secure, {purity} Certified {metalName} Delivered to Your Doorstep
          </p>
        </div>

        {/* Card Container */}
        <div className="
relative z-10
grid
grid-cols-2
lg:grid-cols-4
gap-2
sm:gap-6
px-2 
pb-24 
max-w-[100vw]
mx-auto
min-h-[80vh]
sm:w-[1200px]
">
          {coinProducts.map((coin) => {
            const isWishlisted = wishlist.includes(coin.weight);

            return (
              <div
                key={coin.weight}
                onClick={() => router.push(`/buy-coins/${coin.weight}?metal=${metal}`)}
                className="
group relative
w-full
h-[280px] sm:h-[380px]
bg-white
rounded-2xl
shadow-[0_10px_30px_rgba(0,0,0,0.05)]
overflow-hidden
transition-all duration-500
ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
border border-[rgba(184,150,12,0.1)]
cursor-pointer
hover:h-[420px] 
hover:shadow-[0_20px_50px_rgba(184,150,12,0.15)]
"
                style={{
                  borderColor: `${accentColor}20`,
                  boxShadow: `0 10px 30px ${accentColor}10`,
                }}
              >
                {/* Top Bar */}
                <div className="p-2 md:p-4 flex justify-between items-center" style={{ color: accentColor }}>
                  <div className="flex items-center gap-1 font-bold text-[9px] md:text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 md:w-5 md:h-5" />
                    {isGold ? "24K Gold" : "999 Silver"}
                  </div>

                  <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-normal">
                    In Stock
                  </span>
                </div>

                {/* Image */}
                <div className="w-28 h-32 md:w-40 md:h-44 mx-auto relative transition-transform duration-500 group-hover:scale-110 md:group-hover:scale-125">
                  <Image
                    src={currentImages[coin.weight]}
                    alt={`${metalName} Coin`}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Details */}
                <div className="px-2 sm:px-6 pb-3 md:pb-4 pt-3 md:pt-5 text-center bg-white transition-all duration-500 absolute bottom-0 w-full h-[130px] md:h-[140px] group-hover:h-[180px] md:group-hover:h-[200px] group-hover:pt-1 flex flex-col">

                  {/* Title */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm md:text-lg font-semibold text-[#1a1a2e]/80">
                      {coin.weight} Gram
                    </h3>

                    <button
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(coin.weight);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 md:w-5 md:h-5 ${isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-300 hover:text-gray-400"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] md:text-sm text-gray-500 line-clamp-2 text-left mb-2 md:mb-3 leading-relaxed">
                    {coin.description}
                  </p>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="text-sm md:text-xl font-bold tracking-tight text-gray-600/80">
                      ₹ {(coin.weight * currentPrice).toLocaleString()}
                    </div>

                    <p className="text-[9px] md:text-[11px] text-gray-400 mt-1">
                      {coin.weight}g {isGold ? "24K" : "999"} • Digital {metalName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}