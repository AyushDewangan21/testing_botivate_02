"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, ShoppingCart, Home, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "./store/cartSlice";
import { RootState } from "./store/store";

export default function LumenHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On main page or detail page?
  const isMainPage = pathname === "/buy-coins";

  return (
    <>
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 74px;
          z-index: 50;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(18, 36, 66, 0.12);
          display: flex;
          align-items: center;
          padding: 0 20px;
        }

        .header__inner {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          font-weight: 800;
          font-size: 1.2rem;
          color: #b8960c;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(18, 36, 66, 0.12);
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
          cursor: pointer;
          position: relative;
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 640px) {
          .header {
            height: 60px;
            padding: 0 12px;
          }

          .brand {
            font-size: 0.95rem;
            gap: 6px;
          }

          .icon-btn {
            width: 32px;
            height: 32px;
            border-radius: 10px;
          }

          .badge {
            width: 16px;
            height: 16px;
            font-size: 9px;
          }
        }
      `}</style>

      <header className="header">
        <div className="header__inner">
          <div className="brand" onClick={() => router.push("/")}>
            <div className="relative mr-4 h-5 w-5 scale-150 overflow-hidden rounded-lg sm:h-7 sm:w-7">
              <Image
                src="/02.png"
                alt="ZOLD"
                fill
                className="rounded-l-lg rounded-r-lg object-contain"
              />
            </div>
            <span>ZOLD GOLD</span>
          </div>

          <div className="nav-links hidden gap-10 md:flex ">
            <button
              className="nav-link flex items-center gap-2 text-sm font-bold text-[#B8960C]"
              onClick={() => router.push("/")}
            ><div> <Home size={18} /></div>

              Home
            </button>

            <button
              className="nav-link flex items-center gap-2 text-sm font-bold text-[#B8960C]"
              onClick={() => router.push("/buy-coins")}
            >
              <TrendingUp size={18} />
              Buy Coins
            </button>
          </div>

          <div className="flex gap-3">
            <button
              className="icon-btn text-[#C9A227]"
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="icon-btn text-[#C9A227]"
              onClick={() => dispatch(toggleCart(true))}
            >
              <ShoppingCart size={18} />
              {mounted && totalQty > 0 && (
                <span className="badge">{totalQty}</span>
              )}
            </button>
            <button className="icon-btn text-[#C9A227] md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
