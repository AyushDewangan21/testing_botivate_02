"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
} from "./store/cartSlice";
import { RootState } from "./store/store";
import { CheckCircle, Minus, Plus, Trash2, X, Clock, AlertCircle, Lock } from "lucide-react";
import Image from "next/image";

import img1 from "./images/1gmZold.webp";
import img2 from "./images/2gmZold.webp";
import img5 from "./images/5gmZold.webp";
import img10 from "./images/10gmZold.webp";

const coinImages: Record<number, any> = { 1: img1, 2: img2, 5: img5, 10: img10 };

const SESSION_DURATION = 5 * 60; // seconds

function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function CartDrawer() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { items: storeItems, isOpen: storeIsOpen } = useSelector((state: RootState) => state.cart);
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showExpiredAlert, setShowExpiredAlert] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const items = mounted ? storeItems : [];
    const isOpen = mounted ? storeIsOpen : false;

    const gstRate = 3;
    const totalPrice = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    );
    const gstAmount = (totalPrice * gstRate) / 100;
    const grandTotal = totalPrice + gstAmount;

    // ── Start/reset timer whenever cart opens with items ──
    useEffect(() => {
        if (!isOpen || items.length === 0) return;

        // Check if a session is already running
        const existing = sessionStorage.getItem("cartSessionEnd");
        if (existing) {
            const remaining = Math.floor((parseInt(existing) - Date.now()) / 1000);
            if (remaining > 0) {
                setTimeLeft(remaining);
                setSessionExpired(false);
                return;
            }
        }

        // Start fresh session
        const endTime = Date.now() + SESSION_DURATION * 1000;
        sessionStorage.setItem("cartSessionEnd", endTime.toString());
        setTimeLeft(SESSION_DURATION);
        setSessionExpired(false);
        setShowExpiredAlert(false);
    }, [isOpen, items.length]);

    // ── Countdown ──
    useEffect(() => {
        if (!isOpen || sessionExpired || items.length === 0) return;

        const t = setInterval(() => {
            const saved = sessionStorage.getItem("cartSessionEnd");
            if (!saved) return;
            const remaining = Math.floor((parseInt(saved) - Date.now()) / 1000);

            if (remaining <= 0) {
                setTimeLeft(0);
                setSessionExpired(true);
                setShowExpiredAlert(true);
                dispatch(clearCart());
                sessionStorage.removeItem("cartSessionEnd");
                clearInterval(t);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(t);
    }, [isOpen, sessionExpired, items.length, dispatch]);

    const handleCheckout = () => {
        if (sessionExpired || timeLeft === 0) {
            setShowExpiredAlert(true);
            return;
        }
        dispatch(toggleCart(false));
        router.push("/checkout");
    };

    const timerColor =
        timeLeft <= 60 ? "text-red-600" :
            timeLeft <= 120 ? "text-orange-500" :
                "text-green-600";

    const timerBg =
        timeLeft <= 60 ? "bg-red-50 border-red-300" :
            timeLeft <= 120 ? "bg-orange-50 border-orange-200" :
                "bg-green-50 border-green-200";

    return (
        <>
            <style jsx>{`
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 400px;
          background: white;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .cart-drawer.open { transform: translateX(0); }
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .cart-overlay.open { opacity: 1; pointer-events: auto; }
        .cart-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fdfcf5;
        }
        .cart-content { flex: 1; overflow-y: auto; padding: 20px; }
        .cart-footer {
          padding: 16px 20px;
          border-top: 1px solid #eee;
          background: #fdfcf5;
        }
        .cart-item {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px dashed #eee;
        }
        .qty-badge {
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          border: 1px solid #e5e5e5;
        }
      `}</style>

            <div
                className={`cart-overlay ${isOpen ? "open" : ""}`}
                onClick={() => dispatch(toggleCart(false))}
            />

            <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
                {/* Header */}
                <div className="cart-header text-black">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Your Cart{" "}
                        <span className="text-sm font-normal text-black">({items.length} items)</span>
                    </h2>
                    <button
                        onClick={() => dispatch(toggleCart(false))}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Timer bar (only show when cart has items) */}
                {items.length > 0 && (
                    <div className={`mx-4 mt-3 mb-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold ${timerBg} ${timerColor}`}>
                        {sessionExpired ? (
                            <>
                                <Lock size={14} className="shrink-0" />
                                <span className="flex-1">Session expired — cart cleared</span>
                            </>
                        ) : (
                            <>
                                <Clock size={14} className="shrink-0" />
                                <span className="flex-1">Complete within <strong>{formatTime(timeLeft)}</strong></span>
                                {timeLeft <= 60 && (
                                    <AlertCircle size={14} className="shrink-0 animate-pulse" />
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Warning strip when time is critical */}
                {items.length > 0 && !sessionExpired && timeLeft <= 60 && (
                    <p className="text-center text-xs text-red-500 font-medium px-4 pb-1 animate-pulse">
                        ⚠️ Cart will clear automatically when timer hits 0!
                    </p>
                )}

                {/* Session Expired Alert Banner */}
                {showExpiredAlert && (
                    <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-700">Session Expired</p>
                            <p className="text-xs text-red-500 mt-0.5">Your 5-minute session ended. Cart has been cleared. Please re-add items.</p>
                        </div>
                        <button onClick={() => setShowExpiredAlert(false)} className="ml-auto text-red-400 hover:text-red-600">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Items */}
                <div className="cart-content">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                                <X className="text-gray-300" size={32} />
                            </div>
                            <p className="text-sm font-medium">Your cart is empty</p>
                            {showExpiredAlert && (
                                <button
                                    onClick={() => { setShowExpiredAlert(false); dispatch(toggleCart(false)); }}
                                    className="mt-2 text-xs text-[#B8960C] font-semibold underline"
                                >
                                    Browse Gold Coins
                                </button>
                            )}
                        </div>
                    ) : (
                        items.map((item) => (
                            <div className="cart-item" key={item.weight}>
                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100 relative">
                                    <Image src={coinImages[item.weight]} alt="Gold" width={60} height={60} className="object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm mb-1">{item.weight} Gram Gold Bar</h4>
                                    <p className="text-xs text-gray-500 mb-2">24K (999.9) Pure Gold</p>
                                    <div className="flex justify-between items-end">
                                        <div className="qty-badge">
                                            <button
                                                className="p-1.5 text-[#B8960C]"
                                                onClick={() => dispatch(updateQuantity({ weight: item.weight, quantity: -1 }))}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-bold w-6 text-center text-black">{item.quantity}</span>
                                            <button
                                                className="p-1.5 text-[#B8960C]"
                                                onClick={() => dispatch(updateQuantity({ weight: item.weight, quantity: 1 }))}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-[#B8960C]">₹ {(item.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.weight))}
                                    className="self-start text-gray-300 hover:text-red-400 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>₹ {totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>GST ({gstRate}%)</span>
                                <span>₹ {gstAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-dashed">
                                <span>Total</span>
                                <span>₹ {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={sessionExpired || timeLeft === 0}
                            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${sessionExpired || timeLeft === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-[#B8960C] to-[#D4AF37] text-white hover:shadow-yellow-500/30 hover:scale-[1.01]"
                                }`}
                        >
                            {sessionExpired || timeLeft === 0 ? (
                                <>
                                    <Lock size={18} />
                                    Session Expired
                                </>
                            ) : (
                                <>
                                    Proceed to Checkout <CheckCircle size={18} />
                                </>
                            )}
                        </button>

                        {!sessionExpired && timeLeft > 0 && (
                            <p className="text-center text-xs text-gray-400 mt-2">
                                🔒 Prices locked for {formatTime(timeLeft)} • GST included
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
